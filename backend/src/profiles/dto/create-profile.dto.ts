import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { UserGender } from '@/common/enums/user-gender.enum';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsEnum(UserGender)
  @IsNotEmpty()
  gender: UserGender;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  birth: Date;
}
