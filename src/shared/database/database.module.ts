import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig } from './database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseFactory } from './database.factory';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useClass: DatabaseFactory,
            imports: [ConfigModule.forFeature(databaseConfig)],
        }),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule {}
