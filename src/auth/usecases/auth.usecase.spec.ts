import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/shared/db/prisma.service';
import { HashProvider } from 'src/shared/providers/hash.provider';
import { JwtService } from '@nestjs/jwt';
import { JwtConfig } from '../jwt.config';
import { AuthUsecase, RefreshJwtParams } from './auth.usecase';
import { UnauthorizedException } from '@nestjs/common';
import { AuthJwtDto } from '../dto/auth-jwt.dto';

describe('AuthUsecase', () => {
    let sut: AuthUsecase;

    const HashProviderMock = {
        compare: jest.fn(),
    };

    const jwtServiceMock = {
        signAsync: jest.fn(),
        verifyAsync: jest.fn(async () => ({
            custom: {
                userId: 'id',
                enterpriseId: 'enterpriseId',
            },
        })),
    };

    let prismaMock: PrismaService;
    let findFirstSpy: jest.SpyInstance;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    useValue: {
                        user: {
                            findFirst: jest.fn().mockResolvedValue({
                                id: 'userId',
                                passwordHash: 'hash',
                            }),
                        },
                    },
                    provide: PrismaService,
                },
                {
                    useValue: HashProviderMock,
                    provide: HashProvider,
                },
                {
                    useValue: jwtServiceMock,
                    provide: JwtService,
                },
                {
                    useValue: {
                        secret: 'process.env.JWT_SECRET',
                        expiresIn: 'process.env.JWT_EXPIRES_IN',
                        secretRefresh: 'process.env.JWT_REFRESH_SECRET',
                        expiresInRefresh: 'process.env.JWT_REFRESH_EXPIRES_IN',
                    },
                    provide: JwtConfig,
                },

                AuthUsecase,
            ],
        }).compile();

        sut = app.get<AuthUsecase>(AuthUsecase);

        prismaMock = app.get<PrismaService>(PrismaService);

        HashProviderMock.compare.mockResolvedValue(true);

        jwtServiceMock.signAsync.mockResolvedValue('token');

        findFirstSpy = jest.spyOn(prismaMock.user, 'findFirst');
    });

    it('should be defined.', () => {
        expect(sut).toBeDefined();
    });

    describe('AuthJwtUsecase', () => {
        const makeRequest = (): AuthJwtDto => ({
            account: 'acc',
            password: 'pass',
        });

        it('should be verify user correctly.', async () => {
            const req = makeRequest();

            await sut.signInJwt(req);

            expect(findFirstSpy).toHaveBeenCalledWith({
                select: {
                    id: true,
                    passwordHash: true,
                },
                where: {
                    email: req.account,
                },
            });
        });

        it('should be throw unauthorized if user not exists.', async () => {
            findFirstSpy.mockResolvedValueOnce(undefined);

            await expect(sut.signInJwt(makeRequest())).rejects.toThrow(
                new UnauthorizedException(),
            );
        });

        it('should be verify password correctly.', async () => {
            const req = makeRequest();

            await sut.signInJwt(req);

            const mockedUser = await findFirstSpy.getMockImplementation()();

            expect(HashProviderMock.compare).toHaveBeenCalledWith(
                req.password,
                mockedUser.passwordHash,
            );
        });

        it('should be throw unauthorized if password not match.', async () => {
            HashProviderMock.compare.mockResolvedValueOnce(false);

            await expect(sut.signInJwt(makeRequest())).rejects.toThrow(
                new UnauthorizedException(),
            );
        });

        it('should be create token correctly.', async () => {
            const req = makeRequest();

            const mockedUser = await findFirstSpy.getMockImplementation()();

            await sut.signInJwt(req);

            expect(jwtServiceMock.signAsync).toHaveBeenCalledTimes(2);
            expect(jwtServiceMock.signAsync).toHaveBeenCalledWith(
                {
                    custom: {
                        userId: mockedUser.id,
                        enterpriseId: mockedUser.enterpriseId,
                    },
                },
                expect.objectContaining({
                    expiresIn: expect.any(String),
                    secret: expect.any(String),
                }),
            );
        });
        it('should be jwt auth.', async () => {
            const req = makeRequest();

            const result = await sut.signInJwt(req);

            expect(result).toMatchObject({
                token: expect.any(String),
            });
        });
    });

    describe('RefreshJwtUsecase', () => {
        const makeRequest = (): RefreshJwtParams => ({
            token: 'token',
        });

        it('should be verify token correctly.', async () => {
            const req = makeRequest();

            await sut.refreshJwt(req);

            expect(jwtServiceMock.verifyAsync).toHaveBeenCalledWith(req.token, {
                secret: expect.any(String),
            });
        });

        it('should be throw unauthorized if token is not valid.', async () => {
            jwtServiceMock.verifyAsync.mockImplementationOnce(async () => {
                throw {};
            });

            await expect(sut.refreshJwt(makeRequest())).rejects.toThrow(
                new UnauthorizedException(),
            );
        });

        it('should be create token correctly.', async () => {
            const req = makeRequest();

            await sut.refreshJwt(req);

            expect(jwtServiceMock.signAsync).toHaveBeenCalledTimes(2);
            expect(jwtServiceMock.signAsync).toHaveBeenCalledWith(
                {
                    custom: {
                        userId: 'id',
                        enterpriseId: 'enterpriseId',
                    },
                },
                expect.objectContaining({
                    expiresIn: expect.any(String),
                    secret: expect.any(String),
                }),
            );
        });
        it('should be jwt refresh.', async () => {
            const req = makeRequest();

            const result = await sut.refreshJwt(req);

            expect(result).toMatchObject({
                token: expect.any(String),
            });
        });
    });
});
