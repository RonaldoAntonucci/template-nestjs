import { registerAs } from '@nestjs/config';
import { join } from 'path';
import { DataSourceOptions } from 'typeorm';

export type DatabaseConfig = DataSourceOptions;

export const databaseConfig = registerAs(
    'database',
    (): DatabaseConfig => ({
        type: process.env.DATABASE_TYPE as 'postgres',
        url: process.env.DATABASE_URL,
        migrations: [join('**', 'migrations/*.js')],
    }),
);
