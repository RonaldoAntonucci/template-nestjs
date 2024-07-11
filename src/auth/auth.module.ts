import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { JwtRefreshTokenConfig, JwtTokenConfig } from './auth.config';
import { RolesGuard } from './roles.guard';

@Module({
    imports: [
        JwtModule.register({}),
        ConfigModule.forFeature(JwtTokenConfig),
        ConfigModule.forFeature(JwtRefreshTokenConfig),
    ],
    providers: [
        JwtService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
        AuthService,
    ],
    exports: [ConfigModule, AuthService],
})
export class AuthModule {}
