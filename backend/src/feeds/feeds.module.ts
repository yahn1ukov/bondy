import { Module } from '@nestjs/common';

import { PreferencesModule } from '@/preferences/preferences.module';
import { ProfilesModule } from '@/profiles/profiles.module';

import { FeedsController } from './feeds.controller';
import { FeedsService } from './feeds.service';

@Module({
  imports: [ProfilesModule, PreferencesModule],
  controllers: [FeedsController],
  providers: [FeedsService],
})
export class FeedsModule {}
