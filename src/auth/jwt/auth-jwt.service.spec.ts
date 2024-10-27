import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtRefreshTokenConfig, JwtTokenConfig } from '../auth.config';
import { AuthJwtResponse } from '../auth.service';
import { AuthJwtService } from './auth-jwt.service';

describe('AuthJwtService', () => {
    let service: AuthJwtService;
    let jwtService: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthJwtService,
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

        service = module.get<AuthJwtService>(AuthJwtService);
        jwtService = module.get<JwtService>(JwtService);
    });

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

        const result = await service.execute(payload);

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
