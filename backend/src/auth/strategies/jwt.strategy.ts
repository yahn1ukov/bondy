import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '@/config/config.service';

import { TokenHelper } from '../helpers/token.helper';
import type { ActiveUserData } from '../interfaces/active-user-data.interface';
import type { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly tokenHelper: TokenHelper,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwtAccessSecretKey,
    });
  }

  async validate(payload: JwtPayload): Promise<ActiveUserData> {
    const isBlacklisted = await this.tokenHelper.isBlacklisted(payload.jti);
    if (isBlacklisted) {
      throw new UnauthorizedException('Token revoked');
    }

    return { id: payload.id };
  }
}
