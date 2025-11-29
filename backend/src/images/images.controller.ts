import {
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';

import { ImagesService } from './images.service';

@UseGuards(JwtAuthGuard)
@Controller('images')
export class ImagesController {
  constructor(private readonly service: ImagesService) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async create(
    @CurrentUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    return this.service.create(userId, file);
  }

  @Delete()
  async delete(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.service.delete(userId, id);
  }
}
