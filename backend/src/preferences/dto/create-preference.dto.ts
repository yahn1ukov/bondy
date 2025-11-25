import { IsEnum, IsInt, IsOptional } from 'class-validator';

import { UserGender } from '@/common/enums/user-gender.enum';

export class CreatePreferenceDto {
  @IsEnum(UserGender)
  @IsOptional()
  gender?: UserGender;

  @IsInt()
  @IsOptional()
  minAge?: number;

  @IsInt()
  @IsOptional()
  maxAge?: number;
}
