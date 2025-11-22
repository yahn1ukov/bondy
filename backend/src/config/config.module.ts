import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { ConfigService } from './config.service';
import { validationSchema } from './schemas/config.schema';

@Global()
@Module({
  imports: [NestConfigModule.forRoot({ cache: true, validationSchema })],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
