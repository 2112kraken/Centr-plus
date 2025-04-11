import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { Game } from './game.entity';

export enum LiveGameFeature {
  LIVE_CHAT = 'LIVE_CHAT',
  MULTI_CAMERA = 'MULTI_CAMERA',
  MULTI_TABLE_PLAY = 'MULTI_TABLE_PLAY',
}

@Entity()
export class LiveGame {
  @PrimaryColumn()
  gameId: number;

  @Column({ type: 'int2', nullable: true })
  dealerLanguageId: number;

  @Column({ type: 'float4', nullable: true })
  minBetUsd: number;

  @Column({ type: 'float4', nullable: true })
  maxBetUsd: number;

  @Column({ type: 'int2', nullable: true })
  maxTablePlayers: number;

  @Column({ type: 'int2', nullable: true })
  maxPlayers: number;

  @Column({ type: 'enum', enum: LiveGameFeature, array: true, nullable: true })
  features: LiveGameFeature[];

  @OneToOne(() => Game)
  @JoinColumn({ name: 'gameId' })
  game: Game;
}
