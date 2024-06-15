import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/shared/db/prisma.service';
import { HashProvider } from 'src/shared/providers/hash.provider';
import { JwtService } from '@nestjs/jwt';
import { JwtConfig } from '../jwt.config';
import { AuthJwtDto } from '../dto/auth-jwt.dto';

export type RefreshJwtParams = {
    token: string;
};
@Injectable()
export class AuthUsecase {
    constructor(
        private readonly prisma: PrismaService,
        private readonly hashProvider: HashProvider,
        private readonly jwtService: JwtService,
        private readonly jwtConfig: JwtConfig,
    ) {}

    async signInJwt({ account, password }: AuthJwtDto): Promise<{
        token: string;
        refreshToken: string;
    }> {
        const user = await this.prisma.user.findFirst({
            select: {
                id: true,
                passwordHash: true,
            },
            where: {
                email: account,
            },
        });

        if (!user) {
            throw new UnauthorizedException();
        }

        const compare = await this.hashProvider.compare(
            password,
            user.passwordHash,
        );

        if (!compare) {
            throw new UnauthorizedException();
        }

        const [token, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    custom: {
                        userId: user.id,
                    },
                },
                {
                    expiresIn: this.jwtConfig.expiresIn,
                    secret: this.jwtConfig.secret,
                },
            ),
            this.jwtService.signAsync(
                {
                    custom: {
                        userId: user.id,
                    },
                },
                {
                    expiresIn: this.jwtConfig.expiresInRefresh,
                    secret: this.jwtConfig.secretRefresh,
                },
            ),
        ]);

        return {
            token,
            refreshToken,
        };
    }

    async refreshJwt({ token }: RefreshJwtParams): Promise<{
        token: string;
        refreshToken: string;
    }> {
        const payload = await this.jwtService
            .verifyAsync(token, {
                secret: this.jwtConfig.secretRefresh,
            })
            .catch(() => {
                throw new UnauthorizedException();
            });

        const {
            custom: { userId, enterpriseId },
        } = payload;

        const [newToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    custom: {
                        userId: userId,
                        enterpriseId: enterpriseId,
                    },
                },
                {
                    expiresIn: this.jwtConfig.expiresIn,
                    secret: this.jwtConfig.secret,
                },
            ),
            this.jwtService.signAsync(
                {
                    custom: {
                        userId: userId,
                        enterpriseId: enterpriseId,
                    },
                },
                {
                    expiresIn: this.jwtConfig.expiresInRefresh,
                    secret: this.jwtConfig.secretRefresh,
                },
            ),
        ]);

        return {
            token: newToken,
            refreshToken,
        };
    }
}
