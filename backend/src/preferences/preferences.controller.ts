import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';

import { CreatePreferenceDto } from './dto/create-preference.dto';
import { UpdatePreferenceDto } from './dto/update-preference.dto';
import { PreferencesEntity } from './preferences.entity';
import { PreferencesService } from './preferences.service';

@UseGuards(JwtAuthGuard)
@Controller('preferences')
export class PreferencesController {
  constructor(private readonly service: PreferencesService) {}

  @Post()
  async create(@CurrentUser('id') userId: string, @Body() dto: CreatePreferenceDto): Promise<void> {
    return this.service.create(userId, dto);
  }

  @Get()
  async get(@CurrentUser('id') userId: string): Promise<PreferencesEntity> {
    return this.service.getByUserId(userId);
  }

  @Patch()
  async update(@CurrentUser('id') userId: string, @Body() dto: UpdatePreferenceDto): Promise<void> {
    return this.service.update(userId, dto);
  }
}
