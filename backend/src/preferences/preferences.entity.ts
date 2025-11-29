import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { BaseEntity } from '@/common/entities/base.entity';
import { UserGender } from '@/common/enums/user-gender.enum';
import { ProfilesEntity } from '@/profiles/profiles.entity';

@Entity('preferences')
export class PreferencesEntity extends BaseEntity {
  @Column('enum', { enum: UserGender, default: UserGender.BOTH })
  gender: UserGender;

  @Column('int', { name: 'min_age', nullable: true })
  minAge: number | null;

  @Column('int', { name: 'max_age', nullable: true })
  maxAge: number | null;

  @OneToOne(() => ProfilesEntity, (profile) => profile.preference, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profile_id' })
  profile: ProfilesEntity;
}
