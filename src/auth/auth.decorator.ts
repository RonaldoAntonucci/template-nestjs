import { Reflector } from '@nestjs/core';
import { UserRoles } from './auth.enum';

export const Roles = Reflector.createDecorator<UserRoles[]>();

export const Public = Reflector.createDecorator<void>({
    transform() {
        return true;
    },
});
