import { UserGender } from '@/common/enums/user-gender.enum';
import { LinksEntity } from '@/links/links.entity';
import { ProfilesEntity } from '@/profiles/profiles.entity';

class FeedProfileDto {
  id: string;
  firstName: string;
  lastName: string | null;
  bio: string | null;
  gender: UserGender;
  birth: Date;
  links: LinksEntity[];

  static fromEntity(profile: ProfilesEntity): FeedProfileDto {
    const dto = new FeedProfileDto();

    dto.id = profile.id;
    dto.firstName = profile.firstName;
    dto.lastName = profile.lastName;
    dto.bio = profile.bio;
    dto.gender = profile.gender;
    dto.birth = profile.birth;
    dto.links = profile.links;

    return dto;
  }
}

export class PaginatedFeedDto {
  data: FeedProfileDto[];
  total: number;

  static fromData(profiles: ProfilesEntity[], total: number): PaginatedFeedDto {
    const dto = new PaginatedFeedDto();

    dto.data = profiles.map((profile) => FeedProfileDto.fromEntity(profile));
    dto.total = total;

    return dto;
  }
}
