import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService, AuthJwtResponse } from './auth.service';
import { JwtTokenConfig, JwtRefreshTokenConfig } from './auth.config';

describe('AuthService', () => {
    let service: AuthService;
    let jwtService: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                JwtService,
                {
                    provide: JwtTokenConfig.KEY,
                    useValue: {
                        expiresIn: '1h',
                        secret: 'jwtSecret',
                    },
                },
                {
                    provide: JwtRefreshTokenConfig.KEY,
                    useValue: {
                        expiresIn: '7d',
                        secret: 'refreshTokenSecret',
                    },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        jwtService = module.get<JwtService>(JwtService);
    });

    describe('generateAuthJwt', () => {
        it('should generate an authentication JWT', async () => {
            const payload = { userId: '123' };
            const expectedResponse: AuthJwtResponse = {
                refreshToken: 'generatedRefreshToken',
                token: 'generatedToken',
            };

            vi.spyOn(jwtService, 'signAsync').mockResolvedValueOnce(
                expectedResponse.refreshToken,
            );
            vi.spyOn(jwtService, 'signAsync').mockResolvedValueOnce(
                expectedResponse.token,
            );

            const result = await service.generateAuthJwt(payload);

            expect(result).toEqual(expectedResponse);
            expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
            expect(jwtService.signAsync).toHaveBeenCalledWith(
                { custom: payload },
                {
                    expiresIn: '1h',
                    secret: 'jwtSecret',
                },
            );
            expect(jwtService.signAsync).toHaveBeenCalledWith(
                { custom: payload },
                {
                    expiresIn: '7d',
                    secret: 'refreshTokenSecret',
                },
            );
        });
    });

    describe('refreshToken', () => {
        it('should refresh the authentication token', async () => {
            const token = 'refreshToken';
            const expectedResponse: AuthJwtResponse = {
                token: 'newToken',
                refreshToken: 'newRefreshToken',
            };
            const verifyAsyncMock = vi
                .spyOn(jwtService, 'verifyAsync')
                .mockImplementationOnce(() =>
                    Promise.resolve({ custom: { userId: '123' } }),
                );
            vi.spyOn(service, 'generateAuthJwt').mockImplementationOnce(() =>
                Promise.resolve(expectedResponse),
            );

            const result = await service.refreshToken({ token });

            expect(result).toEqual(expectedResponse);
            expect(verifyAsyncMock).toHaveBeenCalledTimes(1);
            expect(verifyAsyncMock).toHaveBeenCalledWith(token, {
                secret: 'refreshTokenSecret',
            });
            expect(service.generateAuthJwt).toHaveBeenCalledTimes(1);
            expect(service.generateAuthJwt).toHaveBeenCalledWith({
                userId: '123',
            });
        });

        it('should throw UnauthorizedException if token verification fails', async () => {
            const token = 'invalidToken';
            vi.spyOn(jwtService, 'verifyAsync').mockImplementationOnce(() =>
                Promise.reject(new Error()),
            );

            await expect(service.refreshToken({ token })).rejects.toThrow(
                UnauthorizedException,
            );
        });
    });
});
