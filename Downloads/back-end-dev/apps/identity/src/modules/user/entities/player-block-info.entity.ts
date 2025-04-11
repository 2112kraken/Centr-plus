import { PrimaryGeneratedColumn, Column, CreateDateColumn, Entity } from 'typeorm';

import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class PlayerBlockInfo {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Field()
  @Column()
  playerId: string;

  @Field()
  @Column()
  reason: string;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;
}
