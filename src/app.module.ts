import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';

@Module({
    imports: [SharedModule, AuthModule, HealthModule],
})
export class AppModule {}
