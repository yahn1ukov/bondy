import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { QueryFailedError, Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UsersEntity } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly repository: Repository<UsersEntity>,
  ) {}

  async findById(id: string): Promise<UsersEntity | null> {
    return this.repository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<UsersEntity | null> {
    return this.repository.findOneBy({ email });
  }

  async create(dto: CreateUserDto): Promise<UsersEntity> {
    try {
      const user = this.repository.create(dto);
      return await this.repository.save(user);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const dbError = error.driverError as { code: string };
        if (dbError.code === '23505') {
          throw new ConflictException('User with the same email already exists.');
        }
      }

      throw new InternalServerErrorException();
    }
  }

  async updateRefreshToken(id: string, refreshTokenHash: string | null): Promise<void> {
    await this.repository.update(id, { refreshTokenHash });
  }
}
