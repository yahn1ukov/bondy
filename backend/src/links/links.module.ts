import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProfilesModule } from '@/profiles/profiles.module';

import { LinksController } from './links.controller';
import { LinksEntity } from './links.entity';
import { LinksService } from './links.service';

@Module({
  imports: [TypeOrmModule.forFeature([LinksEntity]), ProfilesModule],
  controllers: [LinksController],
  providers: [LinksService],
})
export class LinksModule {}
