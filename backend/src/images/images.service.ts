import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DataSource, Repository } from 'typeorm';

import { MinioService } from '@/minio/minio.service';
import { ProfilesService } from '@/profiles/profiles.service';

import { ImageVariantsEntity } from './entities/image-variants.entity';
import { ImagesEntity } from './entities/images.entity';
import { ImageVariantType } from './enums/image-variant-type.enum';
import { ImagesHelper } from './helpers/images.helper';
import { ProcessedImage } from './interfaces/processed-image.interface';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(ImagesEntity) private readonly repository: Repository<ImagesEntity>,
    private readonly helper: ImagesHelper,
    private readonly dataSource: DataSource,
    private readonly minioService: MinioService,
    private readonly profileService: ProfilesService,
  ) {}

  async create(userId: string, image: Express.Multer.File): Promise<void> {
    const uploadedPaths: string[] = [];

    try {
      const profile = await this.profileService.findByUserId(userId);
      if (!profile) {
        throw new NotFoundException('Profile not found');
      }

      const [blurHash, webImage, mobileImage] = await Promise.all([
        this.helper.generateBlurHash(image.buffer),
        this.helper.processForWeb(image.buffer),
        this.helper.processForMobile(image.buffer),
      ]);

      const imageId = this.helper.generateId();
      const webPath = `profiles/${profile.id}/${imageId}-web.webp`;
      const mobilePath = `profiles/${profile.id}/${imageId}-mobile.jpeg`;

      uploadedPaths.push(webPath, mobilePath);

      await Promise.all([
        this.minioService.upload(webPath, webImage.buffer, webImage.size, webImage.contentType),
        this.minioService.upload(
          mobilePath,
          mobileImage.buffer,
          mobileImage.size,
          mobileImage.contentType,
        ),
      ]);

      await this.dataSource.transaction(async (manager) => {
        const oldImage = await manager.findOne(ImagesEntity, {
          where: { profile: { user: { id: userId } } },
          relations: { variants: true },
          select: { id: true, variants: { path: true } },
        });
        if (oldImage) {
          await manager.delete(ImagesEntity, oldImage.id);

          await this.removeFiles(oldImage.variants.map((variant) => variant.path));
        }

        const newImage = manager.create(ImagesEntity, {
          profile,
          blurHash,
          variants: [
            this.createVariant(ImageVariantType.WEB, webPath, webImage),
            this.createVariant(ImageVariantType.MOBILE, mobilePath, mobileImage),
          ],
        });
        await manager.save(newImage);
      });
    } catch (_: unknown) {
      await this.removeFiles(uploadedPaths);
    }
  }

  async getByUserId(userId: string): Promise<ImagesEntity> {
    const image = await this.repository.findOne({
      where: { profile: { user: { id: userId } } },
      relations: { variants: true },
    });
    if (!image) {
      throw new NotFoundException('Image not found');
    }

    return image;
  }

  async delete(userId: string, id: string): Promise<void> {
    const image = await this.repository.findOne({
      where: { id, profile: { user: { id: userId } } },
      relations: { variants: true },
      select: { id: true, variants: { path: true } },
    });
    if (!image) {
      throw new NotFoundException('Image not found');
    }

    await this.repository.delete(image.id);

    await this.removeFiles(image.variants.map((variant) => variant.path));
  }

  private createVariant(
    type: ImageVariantType,
    path: string,
    image: ProcessedImage,
  ): Partial<ImageVariantsEntity> {
    return {
      type,
      path,
      size: image.size,
      contentType: image.contentType,
      width: image.width,
      height: image.height,
    };
  }

  private async removeFiles(paths: string[]): Promise<void> {
    if (paths.length) {
      await Promise.all(paths.map((path) => this.minioService.remove(path)));
    }
  }
}
