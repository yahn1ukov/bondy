import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CookieHelper } from '@/common/helpers/cookie.helper';
import { ConfigService } from '@/config/config.service';

import { AuthResponseDto } from '../dto/auth-response.dto';
import type { Tokens } from '../interfaces/tokens.interface';

@Injectable()
export class CookieInterceptor implements NestInterceptor<Tokens, AuthResponseDto> {
  constructor(
    private readonly cookieHelper: CookieHelper,
    private readonly configService: ConfigService,
  ) {}

  intercept(ctx: ExecutionContext, next: CallHandler<Tokens>): Observable<AuthResponseDto> {
    return next.handle().pipe(
      map((tokens) => {
        const res = ctx.switchToHttp().getResponse<Response>();

        this.cookieHelper.set(res, tokens.refreshToken);

        return {
          tokenType: this.configService.jwtTokenType,
          accessToken: tokens.accessToken,
          expiresIn: this.configService.jwtAccessExpiresIn,
        };
      }),
    );
  }
}
