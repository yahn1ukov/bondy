import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '@/config/config.service';
import { UsersService } from '@/users/users.service';

import { TokenHelper } from '../helpers/token.helper';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly tokenHelper: TokenHelper,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwtAccessSecretKey,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<ActiveUserData> {
    const accessToken = req.get('authorization')?.replace('Bearer', '').trim();
    if (!accessToken) {
      throw new UnauthorizedException();
    }

    const isBlacklisted = await this.tokenHelper.isBlacklisted(accessToken);
    if (isBlacklisted) {
      throw new UnauthorizedException('Token revoked.');
    }

    const user = await this.usersService.findById(payload.id);
    if (!user) {
      throw new UnauthorizedException();
    }

    return { id: user.id, email: user.email };
  }
}
