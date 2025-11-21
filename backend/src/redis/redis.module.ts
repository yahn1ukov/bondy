import { Module } from '@nestjs/common';

import Redis from 'ioredis';

import { ConfigService } from '@/config/config.service';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): Redis =>
        new Redis({
          host: configService.redisHost,
          port: configService.redisPort,
          password: configService.redisPassword,
        }),
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
