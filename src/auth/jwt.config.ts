import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtConfig {
    secret = process.env.JWT_SECRET;
    expiresIn = process.env.JWT_EXPIRES_IN;

    secretRefresh = process.env.JWT_REFRESH_SECRET;
    expiresInRefresh = process.env.JWT_REFRESH_EXPIRES_IN;
}
