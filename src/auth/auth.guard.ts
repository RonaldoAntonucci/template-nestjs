import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigType } from '@nestjs/config';
import { JwtTokenConfig } from 'src/auth/auth.config';
import { Public } from 'src/shared/decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(JwtTokenConfig.KEY)
        private readonly jwtConfig: ConfigType<typeof JwtTokenConfig>,

        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(Public, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();

        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException();
        }

        const {
            custom: { userId, enterpriseId, roles },
        } = await this.jwtService
            .verifyAsync(token, {
                secret: this.jwtConfig.secret,
            })
            .catch(() => {
                throw new UnauthorizedException();
            });

        request['auth'] = { userId, enterpriseId, roles };

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
