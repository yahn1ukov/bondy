import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { MinioService } from '@/minio/minio.service';
import { ProfilesService } from '@/profiles/profiles.service';

import { FilesEntity } from './files.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FilesEntity) private readonly repository: Repository<FilesEntity>,
    private readonly profileService: ProfilesService,
    private readonly minioService: MinioService,
  ) {}

  async create(userId: string, file: Express.Multer.File): Promise<void> {
    const profile = await this.profileService.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
  }

  async delete(userId: string, id: string): Promise<void> {
    const file = await this.getById(id, userId);

    await this.repository.delete(file.id);
  }

  private async getById(id: string, userId: string): Promise<FilesEntity> {
    const file = await this.repository.findOne({
      where: { id, profile: { user: { id: userId } } },
      select: ['id'],
    });
    if (!file) {
      throw new NotFoundException('File not found');
    }

    return file;
  }
}
