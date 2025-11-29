import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

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
    private readonly profileService: ProfilesService,
    private readonly minioService: MinioService,
  ) {}

  async create(userId: string, file: Express.Multer.File): Promise<void> {
    const profile = await this.profileService.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const [blurHash, webImage, mobileImage] = await Promise.all([
      this.helper.generateBlurhash(file.buffer),
      this.helper.processForWeb(file.buffer),
      this.helper.processForMobile(file.buffer),
    ]);

    const imageId = this.helper.generateId();
    const webImagePath = `profiles/${profile.id}/${imageId}-web.webp`;
    const mobileImagePath = `profiles/${profile.id}/${imageId}-mobile.jpeg`;

    await Promise.all([
      this.minioService.upload(webImagePath, webImage.buffer, webImage.size, webImage.contentType),
      this.minioService.upload(
        mobileImagePath,
        mobileImage.buffer,
        mobileImage.size,
        mobileImage.contentType,
      ),
    ]);

    const image = this.repository.create({
      profile,
      blurHash,
      variants: [
        this.createVariant(ImageVariantType.WEB, webImagePath, webImage),
        this.createVariant(ImageVariantType.MOBILE, mobileImagePath, mobileImage),
      ],
    });
    await this.repository.save(image);
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

    await Promise.all(image.variants.map((variant) => this.minioService.remove(variant.path)));
  }

  private createVariant(
    type: ImageVariantType,
    path: string,
    { size, contentType, width, height }: ProcessedImage,
  ): Partial<ImageVariantsEntity> {
    return { type, path, size, contentType, width, height };
  }
}
