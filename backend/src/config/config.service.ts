import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

interface EnvironmentVariables {
  NODE_ENV: string;
  PORT: number;
  DATABASE_DRIVER: string;
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
  DATABASE_NAME: string;
  S3_ENDPOINT: string;
  S3_PORT: number;
  S3_ACCESS_KEY: string;
  S3_SECRET_KEY: string;
  S3_BUCKET: string;
  S3_REGION: string;
  S3_USE_SSL: boolean;
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD: string;
  JWT_TOKEN_TYPE: string;
  JWT_ACCESS_SECRET_KEY: string;
  JWT_ACCESS_EXPIRES_IN: number;
  JWT_REFRESH_SECRET_KEY: string;
  JWT_REFRESH_EXPIRES_IN: number;
  COOKIE_NAME: string;
  COOKIE_HTTP_ONLY: boolean;
  COOKIE_SAME_SITE: string;
}

@Injectable()
export class ConfigService {
  constructor(private readonly configService: NestConfigService<EnvironmentVariables>) {}

  get isDev(): boolean {
    return this.configService.get('NODE_ENV') === 'development';
  }

  get port(): number {
    return +this.configService.get('PORT', 3000);
  }

  get dbDriver(): string {
    return this.configService.get('DATABASE_DRIVER', '');
  }

  get dbHost(): string {
    return this.configService.get('DATABASE_HOST', '');
  }

  get dbPort(): number {
    return +this.configService.get('DATABASE_PORT', 0);
  }

  get dbUser(): string {
    return this.configService.get('DATABASE_USER', '');
  }

  get dbPassword(): string {
    return this.configService.get('DATABASE_PASSWORD', '');
  }

  get dbName(): string {
    return this.configService.get('DATABASE_NAME', '');
  }

  get s3Endpoint(): string {
    return this.configService.get('S3_ENDPOINT', '');
  }

  get s3Port(): number {
    return +this.configService.get('S3_PORT', 0);
  }

  get s3AccessKey(): string {
    return this.configService.get('S3_ACCESS_KEY', '');
  }

  get s3SecretKey(): string {
    return this.configService.get('S3_SECRET_KEY', '');
  }

  get s3Bucket(): string {
    return this.configService.get('S3_BUCKET', '');
  }

  get s3Region(): string {
    return this.configService.get('S3_REGION', '');
  }

  get s3UseSSL(): boolean {
    return this.configService.get('S3_USE_SSL', false) === 'true';
  }

  get redisHost(): string {
    return this.configService.get('REDIS_HOST', '');
  }

  get redisPort(): number {
    return +this.configService.get('REDIS_PORT', 0);
  }

  get redisPassword(): string {
    return this.configService.get('REDIS_PASSWORD', '');
  }

  get jwtTokenType(): string {
    return this.configService.get('JWT_TOKEN_TYPE', '');
  }

  get jwtAccessSecretKey(): string {
    return this.configService.get('JWT_ACCESS_SECRET_KEY', '');
  }

  get jwtAccessExpiresIn(): number {
    return +this.configService.get('JWT_ACCESS_EXPIRES_IN', 0);
  }

  get jwtRefreshSecretKey(): string {
    return this.configService.get('JWT_REFRESH_SECRET_KEY', '');
  }

  get jwtRefreshExpiresIn(): number {
    return +this.configService.get('JWT_REFRESH_EXPIRES_IN', 0);
  }

  get cookieName(): string {
    return this.configService.get('COOKIE_NAME', '');
  }

  get cookieHttpOnly(): boolean {
    return this.configService.get('COOKIE_HTTP_ONLY', false) === 'true';
  }

  get cookieSecure(): boolean {
    return !this.isDev;
  }

  get cookieSameSite(): string {
    return this.configService.get('COOKIE_SAME_SITE', '');
  }

  get cookieMaxAge(): number {
    return +this.jwtRefreshExpiresIn * 1000;
  }
}
