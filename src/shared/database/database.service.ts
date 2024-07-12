import { Inject, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { databaseConfig } from './database.config';

export class DatabaseService
    extends DataSource
    implements OnModuleInit, OnModuleDestroy
{
    constructor(
        @Inject(databaseConfig.KEY)
        protected readonly config: ConfigType<typeof databaseConfig>,
    ) {
        super(config);
    }

    async onModuleInit(): Promise<void> {
        await this.initialize();
    }

    async onModuleDestroy(): Promise<void> {
        await this.destroy();
    }
}
