import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from './database.service';
import { databaseConfig } from './database.config';

describe('DatabaseService', () => {
    let service: DatabaseService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DatabaseService,
                {
                    provide: databaseConfig.KEY,
                    useValue: {
                        url: 'url',
                        type: 'postgres',
                    },
                },
            ],
        }).compile();

        service = module.get<DatabaseService>(DatabaseService);

        vi.spyOn(service, 'initialize').mockImplementation(async () => service);
        vi.spyOn(service, 'destroy').mockImplementation(async () => {});
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should initialize the database', async () => {
        const initializeSpy = vi.spyOn(service, 'initialize');
        await service.onModuleInit();
        expect(initializeSpy).toBeCalled();
    });

    it('should destroy the database', async () => {
        const destroySpy = vi.spyOn(service, 'destroy');
        await service.onModuleDestroy();
        expect(destroySpy).toBeCalled();
    });
});
