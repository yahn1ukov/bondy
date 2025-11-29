import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MinioModule } from '@/minio/minio.module';
import { ProfilesModule } from '@/profiles/profiles.module';

import { ImagesEntity } from './entities/images.entity';
import { ImagesHelper } from './helpers/images.helper';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';

@Module({
  imports: [MinioModule, TypeOrmModule.forFeature([ImagesEntity]), ProfilesModule],
  controllers: [ImagesController],
  providers: [ImagesService, ImagesHelper],
})
export class ImagesModule {}
