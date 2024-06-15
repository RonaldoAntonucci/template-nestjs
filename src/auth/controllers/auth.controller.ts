import { Body, Controller, Post } from '@nestjs/common';
import { AuthJwtDto } from '../dto/auth-jwt.dto';
import { RefreshJwtDto } from '../dto/refresh-jwt.dto';
import { Public } from 'src/shared/decorators/public.decorator';
import { AuthUsecase } from 'src/auth/usecases/auth.usecase';
import { ApiTags } from '@nestjs/swagger';

@Controller('v1/auth')
@ApiTags('auth')
export class AuthController {
    constructor(private readonly authUsecase: AuthUsecase) {}

    @Public()
    @Post('/jwt')
    async jwt(
        @Body() { account, password }: AuthJwtDto,
    ): Promise<ReturnType<AuthUsecase['signInJwt']>> {
        return this.authUsecase.signInJwt({
            account,
            password,
        });
    }

    @Public()
    @Post('/jwt/refresh')
    async refreshJwt(
        @Body() { token }: RefreshJwtDto,
    ): Promise<ReturnType<AuthUsecase['refreshJwt']>> {
        return this.authUsecase.refreshJwt({
            token,
        });
    }
}
