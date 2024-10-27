import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtRefreshTokenConfig, JwtTokenConfig } from '../auth.config';
import { AuthJwt } from '../auth.types';

@Injectable()
export class AuthJwtService {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(JwtTokenConfig.KEY)
        private readonly jwtConfig: ConfigType<typeof JwtTokenConfig>,
        @Inject(JwtRefreshTokenConfig.KEY)
        private readonly refreshTokenConfig: ConfigType<
            typeof JwtRefreshTokenConfig
        >,
    ) {}

    async execute(payload: Record<string, unknown>): Promise<AuthJwt> {
        const custom = payload;
        const [token, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    custom,
                },
                {
                    expiresIn: this.jwtConfig.expiresIn,
                    secret: this.jwtConfig.secret,
                },
            ),
            this.jwtService.signAsync(
                {
                    custom,
                },
                {
                    expiresIn: this.refreshTokenConfig.expiresIn,
                    secret: this.refreshTokenConfig.secret,
                },
            ),
        ]);

        return {
            token,
            refreshToken,
        };
    }
}
