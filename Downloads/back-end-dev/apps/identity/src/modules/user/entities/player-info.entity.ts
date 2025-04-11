import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

import { Field, ObjectType } from '@nestjs/graphql';

import { Player } from '@identity/modules/user/entities/player.entity';

@ObjectType()
@Entity()
export class PlayerInfo {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  middleName?: string;

  @Field()
  @Column()
  dateOfBirth: Date;

  @Field()
  @Column()
  address: string;

  @Field()
  @Column({ type: 'varchar', precision: 2 })
  countryCode: string;

  @Field()
  @Column({ type: 'varchar', precision: 64 })
  city: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Player)
  @JoinColumn()
  player: Player;
}
