import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [SharedModule, AuthModule],
})
export class AppModule {}
