import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtRefreshTokenConfig } from '../auth.config';
import { RefreshJwtDto } from '../auth.dto';
import { AuthJwt } from '../auth.types';
import { AuthJwtService } from './auth-jwt.service';

@Injectable()
export class RefreshJwtService {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(JwtRefreshTokenConfig.KEY)
        private readonly refreshTokenConfig: ConfigType<
            typeof JwtRefreshTokenConfig
        >,
        private readonly authJwtService: AuthJwtService,
    ) {}

    async execute({ token }: RefreshJwtDto): Promise<AuthJwt> {
        const { custom } = await this.jwtService
            .verifyAsync(token, {
                secret: this.refreshTokenConfig.secret,
            })
            .catch(() => {
                throw new UnauthorizedException();
            });
        return this.authJwtService.execute(custom);
    }
}
