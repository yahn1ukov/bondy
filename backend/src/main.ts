import { ClassSerializerInterceptor, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';

import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { TypeOrmExceptionFilter } from './common/typeorm-exception.filter';
import { ConfigService } from './config/config.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const reflector = app.get(Reflector);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix(configService.appEndpointPrefix);
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: configService.appVersion });
  app.use(helmet());
  app.enableCors({ origin: configService.corsOrigin, credentials: true });
  app.use(cookieParser());
  app.use(compression());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  app.useGlobalFilters(new TypeOrmExceptionFilter());

  await app.listen(configService.port);
}

void bootstrap();
