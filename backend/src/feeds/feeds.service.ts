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

    const query = this.profilesRepository
      .createQueryBuilder('profile')
      .leftJoin('profile.user', 'user')
      .select(['profile.id'])
      .where('user.id != :userId', { userId });

    if (preference.gender !== UserGender.BOTH) {
      query.andWhere('profile.gender = :gender', { gender: preference.gender });
    }

    if (preference.minAge) {
      query.andWhere('EXTRACT(YEAR FROM AGE(profile.birth)) >= :minAge', {
        minAge: preference.minAge,
      });
    }
    if (preference.maxAge) {
      query.andWhere('EXTRACT(YEAR FROM AGE(profile.birth)) <= :maxAge', {
        maxAge: preference.maxAge,
      });
    }

    const [idsData, total] = await query
      .orderBy('RANDOM()')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    if (total === 0) {
      return PaginatedFeedDto.fromData([], total);
    }

    const profileIds = idsData.map((p) => p.id);

    const fullProfiles = await this.profilesRepository
      .createQueryBuilder('profile')
      .leftJoinAndSelect('profile.user', 'user')
      .leftJoinAndSelect('profile.links', 'links')
      .whereInIds(profileIds)
      .getMany();

    return PaginatedFeedDto.fromData(fullProfiles, total);
  }
}
