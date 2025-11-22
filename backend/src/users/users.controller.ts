import { Body, Controller, Delete, Patch, UseGuards } from '@nestjs/common';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';

import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('password')
  async updatePassword(
    @CurrentUser('id') id: string,
    @Body() dto: UpdateUserPasswordDto,
  ): Promise<void> {
    return this.usersService.updatePassword(id, dto);
  }

  @Patch()
  async update(@CurrentUser('id') id: string, @Body() dto: UpdateUserDto): Promise<void> {
    return this.usersService.update(id, dto);
  }

  @Delete()
  async delete(@CurrentUser('id') id: string): Promise<void> {
    return this.usersService.delete(id);
  }
}
