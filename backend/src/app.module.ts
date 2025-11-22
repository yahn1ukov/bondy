import { Module } from '@nestjs/common';
import { ThrottlerModule, type ThrottlerModuleOptions } from '@nestjs/throttler';

import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    RedisModule,
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): ThrottlerModuleOptions => [
        {
          ttl: configService.throttlerTtl,
          limit: configService.throttlerLimit,
        },
      ],
    }),
    CommonModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
