import { Inject, Logger, Module, OnModuleInit } from '@nestjs/common';

import { Client as MinioClient } from 'minio';

import { ConfigService } from '@/config/config.service';

import { MINIO_TOKEN } from './minio.constant';
import { MinioService } from './minio.service';

@Module({
  providers: [
    {
      provide: MINIO_TOKEN,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): MinioClient =>
        new MinioClient({
          port: configService.s3Port,
          accessKey: configService.s3AccessKey,
          secretKey: configService.s3SecretKey,
          endPoint: configService.s3Endpoint,
          region: configService.s3Region,
          useSSL: configService.s3UseSSL,
        }),
    },
    MinioService,
  ],
  exports: [MinioService],
})
export class MinioModule implements OnModuleInit {
  private readonly logger = new Logger(MinioModule.name);

  constructor(
    @Inject(MINIO_TOKEN) private readonly client: MinioClient,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      const isExists = await this.client.bucketExists(this.configService.s3Bucket);
      if (isExists) {
        this.logger.log('Bucket already exists');
        return;
      }

      await this.client.makeBucket(this.configService.s3Bucket, this.configService.s3Region);
      this.logger.log('Bucket created');
    } catch (error: unknown) {
      this.logger.error('Failed to initialize bucket', error);
    }
  }
}
