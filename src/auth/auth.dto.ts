import { IsString } from 'class-validator';

export class RefreshJwtDto {
    @IsString()
    token: string;
}
