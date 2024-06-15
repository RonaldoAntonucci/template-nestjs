import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
    HealthCheckService,
    HealthCheck,
    PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from 'src/shared/db/prisma.service';
import { Public } from 'src/shared/decorators/public.decorator';

@Controller('health')
@ApiTags('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private db: PrismaHealthIndicator,
        private prisma: PrismaService,
    ) {}

    @Get()
    @Public()
    @HealthCheck()
    check(): ReturnType<HealthCheckService['check']> {
        return this.health.check([
            (): ReturnType<PrismaHealthIndicator['pingCheck']> =>
                this.db.pingCheck('database', this.prisma),
        ]);
    }
}
