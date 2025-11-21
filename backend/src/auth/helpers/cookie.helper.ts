import { Injectable } from '@nestjs/common';

import { CookieOptions, Response } from 'express';

import { ConfigService } from '@/config/config.service';

@Injectable()
export class CookieHelper {
  constructor(private readonly configService: ConfigService) {}

  set(res: Response, refreshToken: string): void {
    res.cookie(this.configService.cookieName, refreshToken, {
      httpOnly: this.configService.cookieHttpOnly,
      secure: this.configService.cookieSecure,
      sameSite: this.configService.cookieSameSite as CookieOptions['sameSite'],
      maxAge: this.configService.cookieMaxAge,
    });
  }

  clear(res: Response): void {
    res.clearCookie(this.configService.cookieName, {
      httpOnly: this.configService.cookieHttpOnly,
      secure: this.configService.cookieSecure,
      sameSite: this.configService.cookieSameSite as CookieOptions['sameSite'],
    });
  }
}
