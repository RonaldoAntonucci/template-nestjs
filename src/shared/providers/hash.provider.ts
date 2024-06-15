import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class HashProvider {
    async hash(password: string): Promise<string> {
        return argon2.hash(password);
    }

    async compare(
        plainPassword: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return argon2.verify(hashedPassword, plainPassword);
    }
}
