import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';

import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { LinksEntity } from './links.entity';
import { LinksService } from './links.service';

@UseGuards(JwtAuthGuard)
@Controller('links')
export class LinksController {
  constructor(private readonly service: LinksService) {}

  @Post('new')
  async add(@CurrentUser('id') userId: string, @Body() dto: CreateLinkDto): Promise<void> {
    return this.service.add(userId, dto);
  }

  @Post()
  async create(@CurrentUser('id') userId: string, @Body() dtos: CreateLinkDto[]): Promise<void> {
    return this.service.create(userId, dtos);
  }

  @Get()
  async getAll(@CurrentUser('id') userId: string): Promise<LinksEntity[]> {
    return this.service.getAllByUserId(userId);
  }

  @Patch(':id')
  async update(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLinkDto,
  ): Promise<void> {
    return this.service.update(userId, id, dto);
  }

  @Delete(':id')
  async delete(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.service.delete(userId, id);
  }
}
