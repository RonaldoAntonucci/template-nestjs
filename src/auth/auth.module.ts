import { Module } from '@nestjs/common';

import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { JwtModule } from './jwt/jwt.module';
import { RolesGuard } from './roles.guard';

@Module({
    imports: [JwtModule],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ],
    exports: [JwtModule],
})
export class AuthModule {}
