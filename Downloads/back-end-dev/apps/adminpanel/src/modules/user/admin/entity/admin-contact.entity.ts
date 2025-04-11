import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Field, ObjectType } from '@nestjs/graphql';

import { ContactType } from '@common/dto/contact.dto';
import { ContactSource } from '@common/enum/contact-source.enum';

import { Admin } from '@adminpanel/modules/user/admin/entity/admin.entity';

@ObjectType()
@Entity()
export class AdminContact {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  adminId: string;

  @Field(() => ContactType)
  @Column({ type: 'enum', enum: ContactType })
  type: ContactType;

  @Field()
  @Column()
  value: string;

  @Column({
    type: 'enum',
    enum: ContactSource,
    default: ContactSource.MANUAL,
  })
  source: ContactSource;

  @Field()
  @Column({ type: 'boolean', default: false })
  isMain: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  verifiedAt?: Date;

  @Column({ nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => Admin)
  @JoinColumn({ name: 'adminId' })
  admin: Admin;
}
