import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { LinkType } from '../enums/link-type.enum';

export class CreateLinkDto {
  @IsEnum(LinkType)
  @IsOptional()
  type?: LinkType;

  @IsString()
  @IsNotEmpty()
  ref: string;
}
