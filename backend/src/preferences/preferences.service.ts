import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ProfilesService } from '@/profiles/profiles.service';

import { CreatePreferenceDto } from './dto/create-preference.dto';
import { UpdatePreferenceDto } from './dto/update-preference.dto';
import { PreferencesEntity } from './preferences.entity';

@Injectable()
export class PreferencesService {
  constructor(
    @InjectRepository(PreferencesEntity) private readonly repository: Repository<PreferencesEntity>,
    private readonly profilesService: ProfilesService,
  ) {}

  async findByUserId(userId: string): Promise<PreferencesEntity | null> {
    return this.repository.findOneBy({ profile: { user: { id: userId } } });
  }

  async create(userId: string, dto: CreatePreferenceDto): Promise<void> {
    const profile = await this.profilesService.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const isExists = await this.repository.existsBy({ profile });
    if (isExists) {
      throw new ConflictException('Profile already has a preference');
    }

    const preference = this.repository.create({ ...dto, profile });
    await this.repository.save(preference);
  }

  async getByUserId(userId: string): Promise<PreferencesEntity> {
    const preference = await this.repository.findOneBy({ profile: { user: { id: userId } } });
    if (!preference) {
      throw new NotFoundException('Preference not found');
    }

    return preference;
  }

  async update(userId: string, dto: UpdatePreferenceDto): Promise<void> {
    const preference = await this.getByUserId(userId);

    await this.repository.update({ id: preference.id }, dto);
  }
}
