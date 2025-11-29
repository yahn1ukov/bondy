import { Inject, Injectable } from '@nestjs/common';

import { Client as MinioClient } from 'minio';

import { ConfigService } from '@/config/config.service';

import { MINIO_TOKEN } from './minio.constant';

@Injectable()
export class MinioService {
  constructor(
    @Inject(MINIO_TOKEN) private readonly client: MinioClient,
    private readonly configService: ConfigService,
  ) {}

  async upload(path: string, buffer: Buffer, size: number, contentType: string): Promise<void> {
    await this.client.putObject(this.configService.s3Bucket, path, buffer, size, {
      contentType,
    });
  }

  async remove(path: string): Promise<void> {
    if (!path) {
      return;
    }

    await this.client.removeObject(this.configService.s3Bucket, path);
  }
}
