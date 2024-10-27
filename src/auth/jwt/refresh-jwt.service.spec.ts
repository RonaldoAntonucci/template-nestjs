import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtRefreshTokenConfig, JwtTokenConfig } from '../auth.config';
import { AuthJwt } from '../auth.types';
import { AuthJwtService } from './auth-jwt.service';
import { RefreshJwtService } from './refresh-jwt.service';

describe('RefreshJwtService', () => {
    let service: RefreshJwtService;
    let jwtService: JwtService;
    let authJwtService: AuthJwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RefreshJwtService,
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
                {
                    provide: AuthJwtService,
                    useValue: {
                        execute: vi.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<RefreshJwtService>(RefreshJwtService);
        jwtService = module.get<JwtService>(JwtService);
        authJwtService = module.get<AuthJwtService>(AuthJwtService);
    });

    it('should refresh the authentication token', async () => {
        const token = 'refreshToken';
        const expectedResponse: AuthJwt = {
            token: 'newToken',
            refreshToken: 'newRefreshToken',
        };
        const verifyAsyncMock = vi
            .spyOn(jwtService, 'verifyAsync')
            .mockImplementationOnce(() =>
                Promise.resolve({ custom: { userId: '123' } }),
            );
        vi.spyOn(authJwtService, 'execute').mockImplementationOnce(() =>
            Promise.resolve(expectedResponse),
        );

        const result = await service.execute({ token });

        expect(result).toEqual(expectedResponse);
        expect(verifyAsyncMock).toHaveBeenCalledTimes(1);
        expect(verifyAsyncMock).toHaveBeenCalledWith(token, {
            secret: 'refreshTokenSecret',
        });
        expect(authJwtService.execute).toHaveBeenCalledTimes(1);
        expect(authJwtService.execute).toHaveBeenCalledWith({
            userId: '123',
        });
    });

    it('should throw UnauthorizedException if token verification fails', async () => {
        const token = 'invalidToken';
        vi.spyOn(jwtService, 'verifyAsync').mockImplementationOnce(() =>
            Promise.reject(new Error()),
        );

        await expect(service.execute({ token })).rejects.toThrow(
            UnauthorizedException,
        );
    });
});
