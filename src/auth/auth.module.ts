import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { HashProvider } from 'src/shared/providers/hash.provider';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from './jwt.config';
import { AuthUsecase } from './usecases/auth.usecase';

@Module({
    imports: [JwtModule.register({})],
    providers: [JwtConfig, HashProvider, AuthUsecase],
    controllers: [AuthController],
})
export class AuthModule {}
