import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ProfilesService } from '@/profiles/profiles.service';

import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { LinksEntity } from './links.entity';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(LinksEntity) private readonly repository: Repository<LinksEntity>,
    private readonly profilesService: ProfilesService,
  ) {}

  async create(userId: string, dtos: CreateLinkDto[]): Promise<void> {
    const profile = await this.profilesService.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const links = dtos.map((dto) => this.repository.create({ ...dto, profile }));
    await this.repository.save(links);
  }

  async add(userId: string, dto: CreateLinkDto): Promise<void> {
    const profile = await this.profilesService.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const link = this.repository.create({ ...dto, profile });
    await this.repository.save(link);
  }

  async getAllByUserId(userId: string): Promise<LinksEntity[]> {
    return this.repository.find({ where: { profile: { user: { id: userId } } } });
  }

  async update(userId: string, id: string, dto: UpdateLinkDto): Promise<void> {
    const link = await this.getById(id, userId);

    await this.repository.update(link.id, dto);
  }

  async delete(userId: string, id: string): Promise<void> {
    const link = await this.getById(id, userId);

    await this.repository.delete(link.id);
  }

  private async getById(id: string, userId: string): Promise<LinksEntity> {
    const link = await this.repository.findOne({
      where: { id, profile: { user: { id: userId } } },
      select: ['id'],
    });
    if (!link) {
      throw new NotFoundException('Link not found');
    }

    return link;
  }
}
