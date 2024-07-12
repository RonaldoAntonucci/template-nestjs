import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseFactory } from './database.factory';
import { databaseConfig } from './database.config';

describe('DatabaseFactory', () => {
    let factory: DatabaseFactory;

    const config = {
        url: 'url',
        type: 'postgres',
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DatabaseFactory,
                {
                    provide: databaseConfig.KEY,
                    useValue: config,
                },
            ],
        }).compile();

        factory = module.get<DatabaseFactory>(DatabaseFactory);
    });

    it('should be defined', () => {
        expect(factory).toBeDefined();
    });

    it('should create TypeORM options with autoLoadEntities set to true', () => {
        const options: TypeOrmModuleOptions = factory.createTypeOrmOptions();

        expect(options).toEqual({
            ...config,
            autoLoadEntities: true,
        });
    });
});
