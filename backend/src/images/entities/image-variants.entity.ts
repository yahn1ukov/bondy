import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '@/common/entities/base.entity';

import { ImageVariantType } from '../enums/image-variant-type.enum';
import { ImagesEntity } from './images.entity';

@Entity('image_variants')
export class ImageVariantsEntity extends BaseEntity {
  @Column('enum', { enum: ImageVariantType })
  type: ImageVariantType;

  @Column()
  size: number;

  @Column()
  path: string;

  @Column({ name: 'content_type' })
  contentType: string;

  @Column()
  width: number;

  @Column()
  height: number;

  @ManyToOne(() => ImagesEntity, (image) => image.variants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'image_id' })
  image: ImagesEntity;
}
