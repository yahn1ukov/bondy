import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { BaseEntity } from '@/common/entities/base.entity';
import { Gender } from '@/common/enums/gender.enum';
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

  @Column('enum', { enum: Gender })
  gender: Gender;

  @Column()
  birth: Date;

  @OneToOne(() => UsersEntity, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;
}
