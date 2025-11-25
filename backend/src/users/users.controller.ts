import { Body, Controller, Delete, Get, Patch, Res, UseGuards } from '@nestjs/common';

import type { Response } from 'express';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';
import { CookieHelper } from '@/common/helpers/cookie.helper';

import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersEntity } from './users.entity';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly service: UsersService,
    private readonly cookieHelper: CookieHelper,
  ) {}

  @Get()
  async get(@CurrentUser('id') id: string): Promise<UsersEntity> {
    return this.service.getById(id);
  }

  @Patch('password')
  async updatePassword(
    @CurrentUser('id') id: string,
    @Body() dto: UpdateUserPasswordDto,
  ): Promise<void> {
    return this.service.updatePassword(id, dto);
  }

  @Patch()
  async update(@CurrentUser('id') id: string, @Body() dto: UpdateUserDto): Promise<void> {
    return this.service.update(id, dto);
  }

  @Delete()
  async delete(
    @CurrentUser('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    this.cookieHelper.clear(res);

    return this.service.delete(id);
  }
}
