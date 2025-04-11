import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';

import { Field, ObjectType } from '@nestjs/graphql';

import { GameProvider } from '@games/modules/game/entity/game-provider.entity';
import { GameVendor } from '@games/modules/game/entity/game-vendor.entity';

export enum GameType {
  SLOT = 'SLOT',
  TABLE = 'TABLE',
  LIVE = 'LIVE',
  LOTTERY = 'LOTTERY',
  VIRTUAL = 'VIRTUAL',
  SPORTS = 'SPORTS',
}

export enum GameSubType {
  CLASSIC = 'CLASSIC',
  VIDEO = 'VIDEO',
  PROGRESSIVE = 'PROGRESSIVE',
  BLACKJACK = 'BLACKJACK',
  ROULETTE = 'ROULETTE',
  BACCARAT = 'BACCARAT',
  POKER = 'POKER',
  KENO = 'KENO',
  BINGO = 'BINGO',
  FOOTBALL = 'FOOTBALL',
  TENNIS = 'TENNIS',
  HORSE_RACING = 'HORSE_RACING',
  BASKETBALL = 'BASKETBALL',
}

export enum GameStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
}

@Entity()
@ObjectType()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => GameVendor)
  @JoinColumn({ name: 'vendorId' })
  vendor: GameVendor;

  @ManyToOne(() => GameProvider)
  @JoinColumn({ name: 'providerId' })
  provider: GameProvider;

  @Field(() => String)
  @Column({ length: 64 })
  name: string;

  @Field(() => String)
  @Column({ length: 64 })
  code: string;

  @Field(() => String)
  @Column({ length: 64, unique: true })
  slug: string;

  @Column({
    type: 'enum',
    enum: GameType,
    array: true,
  })
  types: GameType[];

  @Column({
    type: 'enum',
    enum: GameSubType,
    nullable: true,
  })
  subType?: GameSubType;

  @Column('varchar', { array: true, nullable: true, length: 32 })
  currencies?: string[];

  @Column('varchar', { array: true, nullable: true, length: 2 })
  regions?: string[];

  @Column('varchar', { array: true, nullable: true, length: 2 })
  languages?: string[];

  @Column({
    type: 'enum',
    enum: GameStatus,
    default: GameStatus.ENABLED,
  })
  status: GameStatus;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  createdAt: Date;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  updatedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  deletedAt?: Date;
}
