import { registerAs } from '@nestjs/config';

export interface JwtConfig {
    secret: string;
    expiresIn: string;
}

export const JwtTokenConfig = registerAs(
    'Jwt',
    (): JwtConfig => ({
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
    }),
);

export const JwtRefreshTokenConfig = registerAs(
    'JwtRefresh',
    (): JwtConfig => ({
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    }),
);
