import { Column, Entity, Index, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { BaseEntity } from '@/common/entities/base.entity';
import { UserGender } from '@/common/enums/user-gender.enum';
import { ImagesEntity } from '@/images/entities/images.entity';
import { LinksEntity } from '@/links/links.entity';
import { PreferencesEntity } from '@/preferences/preferences.entity';
import { UsersEntity } from '@/users/users.entity';

@Entity('profiles')
export class ProfilesEntity extends BaseEntity {
  @Column({ name: 'first_name' })
  firstName: string;

  @Column('varchar', { name: 'last_name', nullable: true })
  lastName: string | null;

  @Column('text', { nullable: true })
  bio: string | null;

  @Column('enum', { enum: UserGender })
  @Index()
  gender: UserGender;

  @Column()
  @Index()
  birth: Date;

  @OneToOne(() => UsersEntity, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;

  @OneToOne(() => ImagesEntity, (image) => image.profile)
  image: ImagesEntity;

  @OneToOne(() => PreferencesEntity, (preference) => preference.profile)
  preference: PreferencesEntity;

  @OneToMany(() => LinksEntity, (links) => links.profile)
  links: LinksEntity[];
}
