import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';

describe('HealthController', () => {
    let controller: HealthController;
    let health: HealthCheckService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: TypeOrmHealthIndicator,
                    useValue: {
                        pingCheck: vi.fn(),
                    },
                },
                {
                    provide: HealthCheckService,
                    useValue: {
                        check: vi.fn(),
                    },
                },
            ],
            controllers: [HealthController],
        }).compile();

        controller = module.get<HealthController>(HealthController);
        health = module.get<HealthCheckService>(HealthCheckService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should return health check result', async () => {
        const result = {
            status: 'ok',
            info: {
                database: {
                    status: 'up',
                },
            },
        } as any;

        const healthSpy = vi.spyOn(health, 'check').mockReturnValueOnce(result);

        const healthCheckResult = await controller.check();

        expect(healthCheckResult).toEqual(result);
        expect(healthSpy).toBeCalledWith([expect.any(Function)]);
    });
});
