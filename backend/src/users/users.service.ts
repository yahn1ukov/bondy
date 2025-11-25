import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { HashHelper } from '@/common/helpers/hash.helper';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersEntity } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly repository: Repository<UsersEntity>,
    private readonly hashHelper: HashHelper,
  ) {}

  async findById(id: string): Promise<UsersEntity | null> {
    return this.repository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<UsersEntity | null> {
    return this.repository.findOneBy({ email });
  }

  async create(dto: CreateUserDto): Promise<UsersEntity> {
    const isExists = await this.repository.existsBy({ email: dto.email });
    if (isExists) {
      throw new ConflictException('User already exists');
    }

    const user = this.repository.create(dto);
    return await this.repository.save(user);
  }

  async getById(id: string): Promise<UsersEntity> {
    const user = await this.repository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<void> {
    const user = await this.getById(id);

    await this.repository.update(user.id, dto);
  }

  async updatePassword(id: string, dto: UpdateUserPasswordDto): Promise<void> {
    const user = await this.getById(id);

    const isMatch = await this.hashHelper.verify(user.passwordHash, dto.oldPassword);
    if (!isMatch) {
      throw new BadRequestException('Invalid current password');
    }

    const passwordHash = await this.hashHelper.hash(dto.newPassword);

    await this.repository.update(id, { passwordHash });
  }

  async updateRefreshToken(id: string, refreshTokenHash: string | null): Promise<void> {
    await this.repository.update(id, { refreshTokenHash });
  }

  async delete(id: string): Promise<void> {
    const user = await this.getById(id);

    await this.repository.delete(user.id);
  }
}
