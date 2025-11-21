import { NestFactory } from '@nestjs/core';

import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());

  await app.listen(configService.port);
}
bootstrap();
