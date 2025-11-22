import { IsNotEmpty, IsString } from 'class-validator';

import { IsNotMatch } from '@/common/is-not-match.decorator';

export class UpdateUserPasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @IsNotMatch('oldPassword')
  newPassword: string;
}
