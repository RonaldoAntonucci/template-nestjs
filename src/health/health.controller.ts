import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
    HealthCheckService,
    HealthCheck,
    TypeOrmHealthIndicator,
    HealthIndicatorResult,
} from '@nestjs/terminus';
import { Public } from 'src/auth/auth.decorator';

@Controller({
    path: 'health',
    version: VERSION_NEUTRAL,
})
@ApiTags('health')
export class HealthController {
    constructor(
        private readonly health: HealthCheckService,
        private readonly db: TypeOrmHealthIndicator,
    ) {}

    @Get()
    @Public()
    @HealthCheck()
    check(): ReturnType<HealthCheckService['check']> {
        return this.health.check([
            (): Promise<HealthIndicatorResult> => this.db.pingCheck('database'),
        ]);
    }
}
