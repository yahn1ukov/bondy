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

  async upload(file: Express.Multer.File): Promise<void> {
    await this.client.putObject(
      this.configService.s3Bucket,
      file.originalname,
      file.buffer,
      file.size,
      {
        contentType: file.mimetype,
      },
    );
  }

  async remove(objectName: string): Promise<void> {
    await this.client.removeObject(this.configService.s3Bucket, objectName);
  }
}
