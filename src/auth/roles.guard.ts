import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthRequest } from 'src/shared/utils/request.interface';
import { Public, Roles } from './auth.decorator';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly config: ConfigService,
    ) {
        this.ROLES_REQUIRED = this.config.get<boolean>('ROLES_REQUIRED');
    }

    private ROLES_REQUIRED: boolean;

    canActivate(context: ExecutionContext): boolean {
        const getContext = [context.getClass(), context.getHandler()];
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            Public,
            getContext,
        );
        if (isPublic) {
            return true;
        }

        const roles = this.reflector.getAllAndOverride(Roles, getContext);
        if (!roles) {
            if (!this.ROLES_REQUIRED) return true;
            throw new Error(
                `role is required for ${getContext[0].name} method ${getContext[1].name}`,
            );
        }
        const request: AuthRequest = context.switchToHttp().getRequest();
        const user = request.auth;
        return roles.some((role) => user.roles?.includes(role));
    }
}
