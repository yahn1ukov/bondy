import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MinioModule } from '@/minio/minio.module';
import { ProfilesModule } from '@/profiles/profiles.module';

import { FilesController } from './files.controller';
import { FilesEntity } from './files.entity';
import { FilesService } from './files.service';

@Module({
  imports: [MinioModule, TypeOrmModule.forFeature([FilesEntity]), ProfilesModule],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
