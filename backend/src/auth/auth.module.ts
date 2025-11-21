import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';

import { ConfigService } from '@/config/config.service';
import { RedisModule } from '@/redis/redis.module';
import { UsersModule } from '@/users/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { LocalAuthGuard } from './guards/local.guard';
import { CookieHelper } from './helpers/cookie.helper';
import { HashHelper } from './helpers/hash.helper';
import { TokenHelper } from './helpers/token.helper';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    RedisModule,
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => ({
        secret: configService.jwtAccessSecretKey,
        signOptions: {
          expiresIn: configService.jwtAccessExpiresIn,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenHelper,
    CookieHelper,
    HashHelper,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    LocalAuthGuard,
    JwtAuthGuard,
    JwtRefreshAuthGuard,
  ],
})
export class AuthModule {}
