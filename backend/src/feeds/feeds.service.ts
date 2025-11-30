import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { UserGender } from '@/common/enums/user-gender.enum';
import { PreferencesService } from '@/preferences/preferences.service';
import { ProfilesEntity } from '@/profiles/profiles.entity';

import { PaginatedFeedDto } from './dto/paginated-feed.dto';

@Injectable()
export class FeedsService {
  constructor(
    @InjectRepository(ProfilesEntity)
    private readonly profilesRepository: Repository<ProfilesEntity>,
    private readonly preferencesService: PreferencesService,
  ) {}

  async getProfilesByPreferences(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedFeedDto> {
    const preference = await this.preferencesService.findByUserId(userId);
    if (!preference) {
      throw new NotFoundException('Preference not found');
    }

    const offset = (page - 1) * limit;
    const today = new Date();

    const query = this.profilesRepository
      .createQueryBuilder('profile')
      .select(['profile.id'])
      .where('profile.user_id != :userId', { userId });

    if (preference.gender !== UserGender.BOTH) {
      query.andWhere('profile.gender = :gender', { gender: preference.gender });
    }

    if (preference.minAge) {
      const maxBirthDate = new Date(
        today.getFullYear() - preference.minAge,
        today.getMonth(),
        today.getDate(),
      );
      query.andWhere('profile.birth <= :maxBirthDate', { maxBirthDate });
    }
    if (preference.maxAge) {
      const minBirthDate = new Date(
        today.getFullYear() - preference.maxAge - 1,
        today.getMonth(),
        today.getDate(),
      );
      query.andWhere('profile.birth > :minBirthDate', { minBirthDate });
    }

    const [idsData, total] = await query
      .orderBy('RANDOM()')
      .offset(offset)
      .limit(limit)
      .getManyAndCount();

    if (total === 0) {
      return PaginatedFeedDto.fromData([], total);
    }

    const profileIds = idsData.map((p) => p.id);

    const fullProfiles = await this.profilesRepository
      .createQueryBuilder('profile')
      .leftJoinAndSelect('profile.image', 'image')
      .leftJoinAndSelect('image.variants', 'variants')
      .leftJoinAndSelect('profile.links', 'links')
      .where('profile.id IN (:...ids)', { ids: profileIds })
      .getMany();

    return PaginatedFeedDto.fromData(fullProfiles, total);
  }
}
