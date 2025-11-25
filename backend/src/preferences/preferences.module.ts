import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProfilesModule } from '@/profiles/profiles.module';

import { PreferencesController } from './preferences.controller';
import { PreferencesEntity } from './preferences.entity';
import { PreferencesService } from './preferences.service';

@Module({
  imports: [TypeOrmModule.forFeature([PreferencesEntity]), ProfilesModule],
  controllers: [PreferencesController],
  providers: [PreferencesService],
  exports: [PreferencesService],
})
export class PreferencesModule {}
