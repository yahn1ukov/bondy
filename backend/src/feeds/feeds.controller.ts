import { Controller, Get, ParseIntPipe, Query, UseGuards } from '@nestjs/common';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';

import { PaginatedFeedDto } from './dto/paginated-feed.dto';
import { FeedsService } from './feeds.service';

@UseGuards(JwtAuthGuard)
@Controller('feeds')
export class FeedsController {
  constructor(private readonly service: FeedsService) {}

  @Get()
  async getAll(
    @CurrentUser('id') userId: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<PaginatedFeedDto> {
    return this.service.getProfilesByPreferences(userId, page, limit);
  }
}
