import { IsEnum, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

import { LinkType } from '../enums/link-type.enum';

export class CreateLinkDto {
  @IsEnum(LinkType)
  @IsOptional()
  type?: LinkType;

  @IsUrl({ require_protocol: true })
  @IsNotEmpty()
  ref: string;
}
