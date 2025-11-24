import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ProfilesService } from '@/profiles/profiles.service';

import { CreateLinkDto } from './dto/create-link.dto';
import { LinkDto } from './dto/link.dto';
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

  async getAll(userId: string): Promise<LinkDto[]> {
    const links = await this.repository.find({ where: { profile: { user: { id: userId } } } });
    return links.map((link) => new LinkDto(link.id, link.type, link.ref));
  }

  async update(userId: string, id: string, dto: UpdateLinkDto): Promise<void> {
    const link = await this.repository.findOneBy({ id, profile: { user: { id: userId } } });
    if (!link) {
      throw new NotFoundException('Link not found');
    }

    await this.repository.update(id, dto);
  }

  async delete(userId: string, id: string): Promise<void> {
    const link = await this.repository.findOneBy({ id, profile: { user: { id: userId } } });
    if (!link) {
      throw new NotFoundException('Link not found');
    }

    await this.repository.delete(id);
  }
}
