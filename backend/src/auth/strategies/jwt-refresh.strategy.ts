import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Request } from 'express';
import { Strategy } from 'passport-jwt';

import { ConfigService } from '@/config/config.service';

import { AuthService } from '../auth.service';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: (req: Request) => req.cookies[configService.cookieName] as string,
      ignoreExpiration: false,
      secretOrKey: configService.jwtRefreshSecretKey,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<ActiveUserData> {
    const refreshToken = req.cookies[this.configService.cookieName] as string;
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const user = await this.authService.validateRefreshToken(payload.id, refreshToken);
    if (!user) {
      throw new UnauthorizedException();
    }

    return { id: user.id, email: user.email };
  }
}
