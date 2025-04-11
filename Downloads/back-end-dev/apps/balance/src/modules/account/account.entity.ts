import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Directive, Field, ObjectType } from '@nestjs/graphql';

import { CurrencyCode } from '@common/enum/currency.enum';

@ObjectType()
@Directive('@key(fields: "id")')
@Entity()
export class Account {
  @Field()
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Field()
  @Column()
  playerId: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ enum: CurrencyCode })
  currencyCode: CurrencyCode;

  @Field()
  @Column()
  balance: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
