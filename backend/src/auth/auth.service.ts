import { Injectable } from '@nestjs/common';

import { HashHelper } from '@/common/hash.helper';
import { UsersService } from '@/users/users.service';

import { RegisterRequestDto } from './dto/register-request.dto';
import { TokenHelper } from './helpers/token.helper';
import type { ActiveUserData } from './interfaces/active-user-data.interface';
import type { Tokens } from './interfaces/tokens.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashHelper: HashHelper,
    private readonly tokenHelper: TokenHelper,
  ) {}

  async validateUser(email: string, password: string): Promise<ActiveUserData | null> {
    const user = await this.usersService.findByEmail(email.toLowerCase());
    if (!user) {
      return null;
    }

    const isMatch = await this.hashHelper.verify(user.passwordHash, password);
    if (!isMatch) {
      return null;
    }

    return { id: user.id, email: user.email };
  }

  async validateRefreshToken(userId: string, refreshToken: string): Promise<ActiveUserData | null> {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshTokenHash) {
      return null;
    }

    const isMatch = await this.hashHelper.verify(user.refreshTokenHash, refreshToken);
    if (!isMatch) {
      await this.usersService.updateRefreshToken(user.id, null);
      return null;
    }

    return { id: user.id, email: user.email };
  }

  async login(user: ActiveUserData): Promise<Tokens> {
    return this.issueTokens(user);
  }

  async register(dto: RegisterRequestDto): Promise<Tokens> {
    const passwordHash = await this.hashHelper.hash(dto.password);

    const user = await this.usersService.create({ email: dto.email.toLowerCase(), passwordHash });

    return this.issueTokens({ id: user.id, email: user.email });
  }

  async refresh(user: ActiveUserData): Promise<Tokens> {
    return this.issueTokens(user);
  }

  async logout(userId: string, accessToken: string): Promise<void> {
    await this.usersService.updateRefreshToken(userId, null);

    const payload = this.tokenHelper.decode(accessToken);
    if (payload?.jti && payload?.exp) {
      await this.tokenHelper.blacklist(userId, payload.jti, payload.exp);
    }
  }

  async issueTokens(user: ActiveUserData): Promise<Tokens> {
    const tokens = await this.tokenHelper.generate(user);

    const refreshTokenHash = await this.hashHelper.hash(tokens.refreshToken);
    await this.usersService.updateRefreshToken(user.id, refreshTokenHash);

    return tokens;
  }
}
