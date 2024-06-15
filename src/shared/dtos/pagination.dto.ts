import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class PaginationDto {
    @Transform(({ value }) => parseInt(value, 10))
    @IsNumber()
    @IsOptional()
    @Min(0)
    skip?: number = 0;

    @Transform(({ value }) => parseInt(value, 10))
    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(100)
    take?: number = 20;
}
