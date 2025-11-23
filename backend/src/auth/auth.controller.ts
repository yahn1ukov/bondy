import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import type { Response } from 'express';

import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginRequestDto } from './dto/login-request.dto';
import { RegisterRequestDto } from './dto/register-request.dto';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { LocalAuthGuard } from './guards/local.guard';
import { CookieHelper } from './helpers/cookie.helper';
import { CookieInterceptor } from './interceptors/cookie.interceptor';
import type { ActiveUserData } from './interfaces/active-user-data.interface';
import type { Tokens } from './interfaces/tokens.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private readonly cookieHelper: CookieHelper,
  ) {}

  @UseGuards(LocalAuthGuard)
  @UseInterceptors(CookieInterceptor)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() _: LoginRequestDto, @CurrentUser() user: ActiveUserData): Promise<Tokens> {
    return this.service.login(user);
  }

  @UseInterceptors(CookieInterceptor)
  @Post('register')
  async register(@Body() dto: RegisterRequestDto): Promise<Tokens> {
    return this.service.register(dto);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @UseInterceptors(CookieInterceptor)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @CurrentUser() user: ActiveUserData,
    @Headers('authorization') authorizationHeader: string,
  ): Promise<Tokens> {
    const accessToken = authorizationHeader.split(' ')[1];

    return this.service.refresh(user, accessToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @CurrentUser('id') userId: string,
    @Headers('authorization') authorizationHeader: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const accessToken = authorizationHeader.split(' ')[1];

    await this.service.logout(userId, accessToken);

    this.cookieHelper.clear(res);
  }
}
