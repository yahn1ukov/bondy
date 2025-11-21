import { Inject, Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

import Redis from 'ioredis';

import { ConfigService } from '@/config/config.service';
import { REDIS_CLIENT } from '@/redis/redis.module';

import { DecodedToken } from '../interfaces/decoded-token.interface';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { Tokens } from '../interfaces/tokens.interface';

@Injectable()
export class TokenHelper {
  constructor(
    private readonly jwtService: NestJwtService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly configService: ConfigService,
  ) {}

  decode(token: string): DecodedToken | null {
    return this.jwtService.decode(token);
  }

  async generate(payload: JwtPayload): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.jwtAccessSecretKey,
        expiresIn: this.configService.jwtAccessExpiresIn,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.jwtRefreshSecretKey,
        expiresIn: this.configService.jwtRefreshExpiresIn,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async blacklist(userId: string, accessToken: string, expiresIn: number): Promise<void> {
    const now = Math.floor(Date.now() / 1000);
    const ttl = expiresIn - now;

    if (ttl > 0) {
      await this.redis.set(`blacklist:${accessToken}`, userId, 'EX', ttl);
    }
  }

  async isBlacklisted(accessToken: string): Promise<boolean> {
    const exists = await this.redis.exists(`blacklist:${accessToken}`);
    return exists === 1;
  }
}
