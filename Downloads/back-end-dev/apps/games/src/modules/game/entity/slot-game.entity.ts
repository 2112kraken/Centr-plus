import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { Game } from './game.entity';

export enum GameVolatility {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum SlotGameFeature {
  BONUS_ROUND = 'BONUS_ROUND',
  FREE_SPINS = 'FREE_SPINS',
  PROGRESSIVE_JACKPOT = 'PROGRESSIVE_JACKPOT',
  FIXED_JACKPOT = 'FIXED_JACKPOT',
  MULTIPLIER = 'MULTIPLIER',
  AUTOPLAY = 'AUTOPLAY',
}

@Entity()
export class SlotGame {
  @PrimaryColumn()
  gameId: number;

  @Column({ type: 'numeric', nullable: true })
  rpt: string;

  @Column({ type: 'float4', nullable: true })
  minBetUsd: number;

  @Column({ type: 'float4', nullable: true })
  maxBetUsd: number;

  @Column({ type: 'enum', enum: GameVolatility, nullable: true })
  volatility: GameVolatility;

  @Column({ type: 'int2', nullable: true })
  reels: number;

  @Column({ type: 'int2', nullable: true })
  rows: number;

  @Column({ type: 'int2', nullable: true })
  payLines: number;

  @Column({ type: 'enum', enum: SlotGameFeature, array: true, nullable: true })
  features: SlotGameFeature[];

  @OneToOne(() => Game)
  @JoinColumn({ name: 'gameId' })
  game: Game;
}
