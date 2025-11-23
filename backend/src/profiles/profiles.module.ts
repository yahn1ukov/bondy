import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProfilesController } from './profiles.controller';
import { ProfilesEntity } from './profiles.entity';
import { ProfilesService } from './profiles.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProfilesEntity])],
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule {}
