import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { Game } from './game.entity';

export enum TableGameFeature {
  LIVE_DEALER = 'LIVE_DEALER',
  AUTO_DEALER = 'AUTO_DEALER',
  MULTI_HAND = 'MULTI_HAND',
  SIDE_BETS = 'SIDE_BETS',
  TIME_LIMIT = 'TIME_LIMIT',
}

@Entity()
export class TableGame {
  @PrimaryColumn()
  gameId: number;

  @Column({ type: 'int2', nullable: true })
  dealerLanguageId: number;

  @Column({ type: 'int2', nullable: true })
  deckCount: number;

  @Column({ type: 'int2', nullable: true })
  jokersCount: number;

  @Column({ type: 'float4', nullable: true })
  minBetUsd: number;

  @Column({ type: 'float4', nullable: true })
  maxBetUsd: number;

  @Column({ type: 'int2', nullable: true })
  maxTablePlayers: number;

  @Column({ type: 'int2', nullable: true })
  maxPlayers: number;

  @Column({ type: 'float4', nullable: true })
  rakePercent: number;

  @Column({ type: 'enum', enum: TableGameFeature, array: true, nullable: true })
  features: TableGameFeature[];

  @OneToOne(() => Game)
  @JoinColumn({ name: 'gameId' })
  game: Game;
}
