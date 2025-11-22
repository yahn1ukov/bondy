import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';

import type { Response } from 'express';

import { ConfigService } from '@/config/config.service';

import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { RegisterRequestDto } from './dto/register-request.dto';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { LocalAuthGuard } from './guards/local.guard';
import { CookieHelper } from './helpers/cookie.helper';
import type { ActiveUserData } from './interfaces/active-user-data.interface';
import type { Tokens } from './interfaces/tokens.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieHelper: CookieHelper,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() _: LoginRequestDto,
    @CurrentUser() user: ActiveUserData,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const tokens = await this.authService.login(user);

    return this.buildResponse(res, tokens);
  }

  @Post('register')
  async register(
    @Body() dto: RegisterRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const tokens = await this.authService.register(dto);

    return this.buildResponse(res, tokens);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @CurrentUser() user: ActiveUserData,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const tokens = await this.authService.refresh(user);

    return this.buildResponse(res, tokens);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @CurrentUser('id') userId: string,
    @Headers('authorization') header: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const accessToken = header.split(' ')[1];

    await this.authService.logout(userId, accessToken);

    this.cookieHelper.clear(res);
  }

  private buildResponse(res: Response, tokens: Tokens): AuthResponseDto {
    this.cookieHelper.set(res, tokens.refreshToken);

    return {
      tokenType: this.configService.jwtTokenType,
      accessToken: tokens.accessToken,
      expiresIn: this.configService.jwtAccessExpiresIn,
    };
  }
}
