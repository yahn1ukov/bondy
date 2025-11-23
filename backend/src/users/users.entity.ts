import { Exclude } from 'class-transformer';
import { Column, Entity, OneToOne } from 'typeorm';

import { BaseEntity } from '@/common/entities/base.entity';
import { ProfilesEntity } from '@/profiles/profiles.entity';

@Entity('users')
export class UsersEntity extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  @Exclude()
  passwordHash: string;

  @Column('varchar', { name: 'refresh_token_hash', nullable: true })
  @Exclude()
  refreshTokenHash: string | null;

  @OneToOne(() => ProfilesEntity, (profile) => profile.user)
  profile: ProfilesEntity;
}
