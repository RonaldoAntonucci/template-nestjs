import { Request } from 'express';
import { UserRoles } from 'src/auth/auth.enum';

export interface AuthRequest extends Request {
    auth: {
        userId: string;
        enterpriseId: string;
        roles: UserRoles[];
    };
}
