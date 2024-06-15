import { IsString } from 'class-validator';

export class AuthJwtDto {
    @IsString()
    account: string;

    @IsString()
    password: string;
}
