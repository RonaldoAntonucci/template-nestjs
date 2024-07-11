import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtRefreshTokenConfig, JwtTokenConfig } from './auth.config';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { RefreshJwtDto } from './auth.dto';

export type AuthJwtResponse = {
    token: string;
    refreshToken: string;
};

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(JwtTokenConfig.KEY)
        private readonly jwtConfig: ConfigType<typeof JwtTokenConfig>,
        @Inject(JwtRefreshTokenConfig.KEY)
        private readonly refreshTokenConfig: ConfigType<
            typeof JwtRefreshTokenConfig
        >,
    ) {}
    async generateAuthJwt(
        payload: Record<string, unknown>,
    ): Promise<AuthJwtResponse> {
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

    async refreshToken({ token }: RefreshJwtDto): Promise<{
        token: string;
        refreshToken: string;
    }> {
        const { custom } = await this.jwtService
            .verifyAsync(token, {
                secret: this.refreshTokenConfig.secret,
            })
            .catch(() => {
                throw new UnauthorizedException();
            });
        return this.generateAuthJwt(custom);
    }
}
