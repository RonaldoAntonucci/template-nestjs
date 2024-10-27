import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from './database-naming.strategy';
import { databaseConfig } from './database.config';

@Injectable()
export class DatabaseFactory implements TypeOrmOptionsFactory {
    constructor(
        @Inject(databaseConfig.KEY)
        protected readonly config: ConfigType<typeof databaseConfig>,
        private readonly namingStrategy: SnakeNamingStrategy,
    ) {}
    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            ...this.config,
            autoLoadEntities: true,
            namingStrategy: this.namingStrategy,
        };
    }
}
