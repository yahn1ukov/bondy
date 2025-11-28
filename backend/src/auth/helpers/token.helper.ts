import { Inject, Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

import { randomUUID } from 'crypto';
import Redis from 'ioredis';

import { ConfigService } from '@/config/config.service';
import { REDIS_TOKEN } from '@/redis/redis.constant';

import type { ActiveUserData } from '../interfaces/active-user-data.interface';
import type { DecodedToken } from '../interfaces/decoded-token.interface';
import type { JwtPayload } from '../interfaces/jwt-payload.interface';
import type { Tokens } from '../interfaces/tokens.interface';

@Injectable()
export class TokenHelper {
  constructor(
    private readonly jwtService: NestJwtService,
    @Inject(REDIS_TOKEN) private readonly redis: Redis,
    private readonly configService: ConfigService,
  ) {}

  decode(token: string): DecodedToken | null {
    return this.jwtService.decode(token);
  }

  async generate(user: ActiveUserData): Promise<Tokens> {
    const payload: JwtPayload = { id: user.id, jti: randomUUID() };

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

  async blacklist(userId: string, jti: string, expiresIn: number): Promise<void> {
    const now = Math.floor(Date.now() / 1000);
    const ttl = expiresIn - now;

    if (ttl > 0) {
      await this.redis.set(`blacklist:${jti}`, userId, 'EX', ttl);
    }
  }

  async isBlacklisted(jti: string): Promise<boolean> {
    const exists = await this.redis.exists(`blacklist:${jti}`);
    return exists === 1;
  }
}
