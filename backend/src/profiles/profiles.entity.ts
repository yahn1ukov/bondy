import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { BaseEntity } from '@/common/entities/base.entity';
import { UserGender } from '@/common/enums/user-gender.enum';
import { LinksEntity } from '@/links/links.entity';
import { UsersEntity } from '@/users/users.entity';

@Entity('profiles')
export class ProfilesEntity extends BaseEntity {
  @Column({ name: 'first_name' })
  @Exclude()
  firstName: string;

  @Column('varchar', { name: 'last_name', nullable: true })
  @Exclude()
  lastName: string | null;

  @Expose()
  get fullName(): string {
    return [this.firstName, this.lastName].filter(Boolean).join(' ');
  }

  @Column('text', { nullable: true })
  bio: string | null;

  @Column('enum', { enum: UserGender })
  gender: UserGender;

  @Column()
  birth: Date;

  @OneToOne(() => UsersEntity, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;

  @OneToMany(() => LinksEntity, (links) => links.profile)
  links: LinksEntity[];
}
