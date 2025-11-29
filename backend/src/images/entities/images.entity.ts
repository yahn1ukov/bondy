import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { BaseEntity } from '@/common/entities/base.entity';
import { ProfilesEntity } from '@/profiles/profiles.entity';

import { ImageVariantsEntity } from './image-variants.entity';

@Entity('images')
export class ImagesEntity extends BaseEntity {
  @Column({ name: 'blur_hash' })
  blurHash: string;

  @OneToMany(() => ImageVariantsEntity, (variants) => variants.image, {
    cascade: true,
    eager: true,
  })
  variants: ImageVariantsEntity[];

  @OneToOne(() => ProfilesEntity, (profile) => profile.image, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profile_id' })
  profile: ProfilesEntity;
}
