import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '@/common/entities/base.entity';
import { ProfilesEntity } from '@/profiles/profiles.entity';

import { LinkType } from './enums/link-type.enum';

@Entity('links')
export class LinksEntity extends BaseEntity {
  @Column('enum', { enum: LinkType, default: LinkType.OTHER })
  type: LinkType;

  @Column()
  ref: string;

  @ManyToOne(() => ProfilesEntity, (profile) => profile.links, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profile_id' })
  profile: ProfilesEntity;
}
