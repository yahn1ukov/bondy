import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

import type { CookieOptions } from 'express';

import type { EnvironmentVariables } from './interfaces/config.interface';

@Injectable()
export class ConfigService {
  constructor(private readonly configService: NestConfigService<EnvironmentVariables>) {}

  get isDev(): boolean {
    return this.configService.getOrThrow('NODE_ENV') === 'development';
  }

  get port(): number {
    return this.configService.getOrThrow<number>('PORT');
  }

  get appEndpointPrefix(): string {
    return this.configService.getOrThrow('APP_ENDPOINT_PREFIX');
  }

  get appVersion(): string {
    return this.configService.getOrThrow('APP_VERSION');
  }

  get corsOrigin(): string {
    return this.configService.getOrThrow('CORS_ORIGIN');
  }

  get throttlerTtl(): number {
    return this.configService.getOrThrow<number>('THROTTLER_TTL');
  }

  get throttlerLimit(): number {
    return this.configService.getOrThrow<number>('THROTTLER_LIMIT');
  }

  get dbType(): string {
    return this.configService.getOrThrow('DATABASE_TYPE');
  }

  get dbHost(): string {
    return this.configService.getOrThrow('DATABASE_HOST');
  }

  get dbPort(): number {
    return this.configService.getOrThrow<number>('DATABASE_PORT');
  }

  get dbUser(): string {
    return this.configService.getOrThrow('DATABASE_USER');
  }

  get dbPassword(): string {
    return this.configService.getOrThrow('DATABASE_PASSWORD');
  }

  get dbName(): string {
    return this.configService.getOrThrow('DATABASE_NAME');
  }

  get s3Endpoint(): string {
    return this.configService.getOrThrow('S3_ENDPOINT');
  }

  get s3Port(): number {
    return this.configService.getOrThrow<number>('S3_PORT');
  }

  get s3AccessKey(): string {
    return this.configService.getOrThrow('S3_ACCESS_KEY');
  }

  get s3SecretKey(): string {
    return this.configService.getOrThrow('S3_SECRET_KEY');
  }

  get s3Bucket(): string {
    return this.configService.getOrThrow('S3_BUCKET');
  }

  get s3Region(): string {
    return this.configService.getOrThrow('S3_REGION');
  }

  get s3UseSSL(): boolean {
    return this.configService.getOrThrow<boolean>('S3_USE_SSL');
  }

  get redisHost(): string {
    return this.configService.getOrThrow('REDIS_HOST');
  }

  get redisPort(): number {
    return this.configService.getOrThrow<number>('REDIS_PORT');
  }

  get redisPassword(): string {
    return this.configService.getOrThrow('REDIS_PASSWORD');
  }

  get jwtTokenType(): string {
    return this.configService.getOrThrow('JWT_TOKEN_TYPE');
  }

  get jwtAccessSecretKey(): string {
    return this.configService.getOrThrow('JWT_ACCESS_SECRET_KEY');
  }

  get jwtAccessExpiresIn(): number {
    return this.configService.getOrThrow<number>('JWT_ACCESS_EXPIRES_IN');
  }

  get jwtRefreshSecretKey(): string {
    return this.configService.getOrThrow('JWT_REFRESH_SECRET_KEY');
  }

  get jwtRefreshExpiresIn(): number {
    return this.configService.getOrThrow<number>('JWT_REFRESH_EXPIRES_IN');
  }

  get cookieName(): string {
    return this.configService.getOrThrow('COOKIE_NAME');
  }

  get cookieHttpOnly(): boolean {
    return this.configService.getOrThrow<boolean>('COOKIE_HTTP_ONLY');
  }

  get cookieSecure(): boolean {
    return !this.isDev;
  }

  get cookieSameSite(): CookieOptions['sameSite'] {
    return this.configService.getOrThrow('COOKIE_SAME_SITE');
  }

  get cookieMaxAge(): number {
    return this.jwtRefreshExpiresIn * 1000;
  }
}
