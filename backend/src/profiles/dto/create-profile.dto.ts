import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { Gender } from '@/common/enums/gender.enum';

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

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  birth: Date;
}
