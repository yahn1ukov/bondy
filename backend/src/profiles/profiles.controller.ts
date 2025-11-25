import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';

import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfilesEntity } from './profiles.entity';
import { ProfilesService } from './profiles.service';

@UseGuards(JwtAuthGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly service: ProfilesService) {}

  @Post()
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateProfileDto): Promise<void> {
    return this.service.create(userId, dto);
  }

  @Get()
  async get(@CurrentUser('id') userId: string): Promise<ProfilesEntity> {
    return this.service.getByUserId(userId);
  }

  @Patch()
  async update(@CurrentUser('id') userId: string, @Body() dto: UpdateProfileDto): Promise<void> {
    return this.service.update(userId, dto);
  }
}
