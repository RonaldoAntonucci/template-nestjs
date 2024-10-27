import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService, JwtModule as NestjsJwtModule } from '@nestjs/jwt';
import { JwtRefreshTokenConfig, JwtTokenConfig } from '../auth.config';
import { AuthJwtService } from './auth-jwt.service';

@Module({
    imports: [
        NestjsJwtModule.register({}),
        ConfigModule.forFeature(JwtTokenConfig),
        ConfigModule.forFeature(JwtRefreshTokenConfig),
    ],
    providers: [JwtService, AuthJwtService],
    exports: [AuthJwtService, ConfigModule],
})
export class JwtModule {}
