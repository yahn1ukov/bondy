import { Inject, Logger, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import Redis from 'ioredis';

import { ConfigService } from '@/config/config.service';

import { REDIS_TOKEN } from './redis.constant';

@Module({
  providers: [
    {
      provide: REDIS_TOKEN,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): Redis =>
        new Redis({
          host: configService.redisHost,
          port: configService.redisPort,
          password: configService.redisPassword,
        }),
    },
  ],
  exports: [REDIS_TOKEN],
})
export class RedisModule implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisModule.name);

  constructor(@Inject(REDIS_TOKEN) private readonly redis: Redis) {}

  async onModuleInit(): Promise<void> {
    try {
      await this.redis.ping();
      this.logger.log('Redis connection established');
    } catch (error: unknown) {
      this.logger.error('Redis connection failed', error);
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.redis.quit();
    this.logger.log('Redis connection closed');
  }
}
