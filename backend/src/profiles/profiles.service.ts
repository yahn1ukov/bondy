import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfilesEntity } from './profiles.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(ProfilesEntity) private readonly repository: Repository<ProfilesEntity>,
  ) {}

  async findByUserId(userId: string): Promise<ProfilesEntity | null> {
    return this.repository.findOne({ where: { user: { id: userId } }, select: ['id'] });
  }

  async create(userId: string, dto: CreateProfileDto): Promise<void> {
    const isExists = await this.repository.existsBy({ user: { id: userId } });
    if (isExists) {
      throw new ConflictException('User already has a profile');
    }

    const profile = this.repository.create({ ...dto, user: { id: userId } });
    await this.repository.save(profile);
  }

  async getByUserId(userId: string): Promise<ProfilesEntity> {
    const profile = await this.repository.findOneBy({ user: { id: userId } });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async update(userId: string, dto: UpdateProfileDto): Promise<void> {
    const profile = await this.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    await this.repository.update(profile.id, dto);
  }
}
