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

import { Player } from '@adminpanel/modules/user/player/entity/player.entity';

@ObjectType()
@Entity()
export class PlayerContact {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  playerId: string;

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

  @ManyToOne(() => Player)
  @JoinColumn({ name: 'playerId' })
  player: Player;
}
