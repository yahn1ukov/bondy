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

  async create(userId: string, dto: CreateProfileDto): Promise<void> {
    const isExists = await this.repository.existsBy({ user: { id: userId } });
    if (isExists) {
      throw new ConflictException('User already has a profile');
    }

    const profile = this.repository.create({ ...dto, user: { id: userId } });
    await this.repository.save(profile);
  }

  async update(userId: string, dto: UpdateProfileDto): Promise<void> {
    const result = await this.repository.update({ user: { id: userId } }, dto);
    if (result.affected === 0) {
      throw new NotFoundException('Profile not found');
    }
  }
}
