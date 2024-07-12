import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { databaseConfig } from './database.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class DatabaseFactory implements TypeOrmOptionsFactory {
    constructor(
        @Inject(databaseConfig.KEY)
        protected readonly config: ConfigType<typeof databaseConfig>,
    ) {}
    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            ...this.config,
            autoLoadEntities: true,
        };
    }
}
