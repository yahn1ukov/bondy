import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule, type ThrottlerModuleOptions } from '@nestjs/throttler';

import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { DatabaseModule } from './database/database.module';
import { FeedsModule } from './feeds/feeds.module';
import { ImagesModule } from './images/images.module';
import { LinksModule } from './links/links.module';
import { MinioModule } from './minio/minio.module';
import { PreferencesModule } from './preferences/preferences.module';
import { ProfilesModule } from './profiles/profiles.module';
import { RedisModule } from './redis/redis.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    RedisModule,
    MinioModule,
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
    AuthModule,
    UsersModule,
    ProfilesModule,
    PreferencesModule,
    ImagesModule,
    LinksModule,
    FeedsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
