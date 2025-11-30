import { Injectable } from '@nestjs/common';

import { encode } from 'blurhash';
import { randomUUID } from 'crypto';
import sharp from 'sharp';

import { ProcessedImage } from '../interfaces/processed-image.interface';

@Injectable()
export class ImagesHelper {
  private readonly TARGET_WIDTH = 1080;
  private readonly TARGET_HEIGHT = 1350;

  generateId(): string {
    return randomUUID();
  }

  async generateBlurHash(buffer: Buffer): Promise<string> {
    const { data, info } = await sharp(buffer)
      .raw()
      .ensureAlpha()
      .resize(32, 40, { fit: 'fill' })
      .toBuffer({ resolveWithObject: true });

    return encode(new Uint8ClampedArray(data), info.width, info.height, 4, 5);
  }

  async processForWeb(buffer: Buffer): Promise<ProcessedImage> {
    return this.processImage(buffer, 'webp', { quality: 80 });
  }

  async processForMobile(buffer: Buffer): Promise<ProcessedImage> {
    return this.processImage(buffer, 'jpeg', { quality: 90, mozjpeg: true });
  }

  private async processImage(
    buffer: Buffer,
    format: 'webp' | 'jpeg',
    options: object,
  ): Promise<ProcessedImage> {
    const { data, info } = await sharp(buffer)
      .rotate()
      .resize(this.TARGET_WIDTH, this.TARGET_HEIGHT, {
        fit: 'cover',
        position: sharp.strategy.attention,
      })
      [format](options)
      .toBuffer({ resolveWithObject: true });

    return {
      buffer: data,
      size: info.size,
      contentType: `image/${format}`,
      width: info.width,
      height: info.height,
    };
  }
}
