import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';
import { Public } from 'src/auth/auth.decorator';

@Controller('health')
@ApiTags('health')
export class HealthController {
    constructor(private health: HealthCheckService) {}

    @Get()
    @Public()
    @HealthCheck()
    check(): ReturnType<HealthCheckService['check']> {
        return this.health.check([]);
    }
}
