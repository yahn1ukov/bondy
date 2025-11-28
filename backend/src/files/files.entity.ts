import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { BaseEntity } from '@/common/entities/base.entity';
import { ProfilesEntity } from '@/profiles/profiles.entity';

@Entity('files')
export class FilesEntity extends BaseEntity {
  @Column({ name: 'blur_hash' })
  blurHash: string;

  @Column({ name: 'web_path' })
  webPath: string;

  @Column({ name: 'web_width' })
  webWidth: number;

  @Column({ name: 'web_height' })
  webHeight: number;

  @Column({ name: 'mobile_path' })
  mobilePath: string;

  @Column({ name: 'mobile_width' })
  mobileWidth: number;

  @Column({ name: 'mobile_height' })
  mobileHeight: number;

  @OneToOne(() => ProfilesEntity, (profile) => profile.file, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profile_id' })
  @Exclude()
  profile: ProfilesEntity;
}
