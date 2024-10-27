import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from './database-naming.strategy';
import { databaseConfig } from './database.config';
import { DatabaseFactory } from './database.factory';

describe('DatabaseFactory', () => {
    let factory: DatabaseFactory;
    let namingStrategy: SnakeNamingStrategy;

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
                {
                    provide: SnakeNamingStrategy,
                    useValue: {},
                },
            ],
        }).compile();

        factory = module.get<DatabaseFactory>(DatabaseFactory);
        namingStrategy = module.get<SnakeNamingStrategy>(SnakeNamingStrategy);
    });

    it('should be defined', () => {
        expect(factory).toBeDefined();
    });

    it('should create TypeORM options with autoLoadEntities set to true', () => {
        const options: TypeOrmModuleOptions = factory.createTypeOrmOptions();

        expect(options).toEqual({
            ...config,
            autoLoadEntities: true,
            namingStrategy,
        });
    });
});
