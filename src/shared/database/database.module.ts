import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from './database-naming.strategy';
import { databaseConfig } from './database.config';
import { DatabaseFactory } from './database.factory';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useClass: DatabaseFactory,
            imports: [ConfigModule.forFeature(databaseConfig)],
            extraProviders: [SnakeNamingStrategy],
        }),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule {}
