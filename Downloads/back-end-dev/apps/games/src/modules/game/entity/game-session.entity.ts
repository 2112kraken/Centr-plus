import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

import { CurrencyCode } from '@common/enum/currency.enum';

import { GameProvider } from '@games/modules/game/entity/game-provider.entity';
import { GameVendor } from '@games/modules/game/entity/game-vendor.entity';
import { Game } from '@games/modules/game/entity/game.entity';

export enum SessionCloseReason {
  GAME_DISABLED = 'GAME_DISABLED',
  PLAYER_BLOCKED = 'PLAYER_BLOCKED',
  MANUAL_CLOSE = 'MANUAL_CLOSE',
}

@Entity()
export class GameSession {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column()
  externalId: string;

  @Column()
  playerId: string;

  @Column()
  accountId: string;

  @Column()
  gameId: number;

  @Column()
  providerId: number;

  @Column()
  vendorId: number;

  @Column({ type: 'numeric' })
  totalBetUsd: string;

  @Column({ type: 'numeric' })
  totalWinUsd: string;

  @Column({ type: 'numeric' })
  totalRollbackUsd: string;

  @Column({ type: 'numeric' })
  totalBet: string;

  @Column({ type: 'numeric' })
  totalWin: string;

  @Column({ type: 'numeric' })
  totalRollback: string;

  @Column()
  totalBetCount: number;

  @Column()
  totalWinCount: number;

  @Column()
  totalRollbackCount: number;

  @Column({ enum: CurrencyCode })
  gameCurrencyCode: CurrencyCode;

  @Column({ enum: CurrencyCode })
  accountCurrencyCode: CurrencyCode;

  @ManyToOne(() => GameProvider)
  @JoinColumn({ name: 'providerId' })
  provider: GameProvider;

  @ManyToOne(() => GameVendor)
  @JoinColumn({ name: 'vendorId' })
  vendor: GameVendor;

  @ManyToOne(() => Game)
  @JoinColumn({ name: 'gameId' })
  game: Game;

  @Column({ type: 'timestamptz', nullable: true })
  activatedAt?: Date;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  closedAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  lastBetAt?: Date;

  @Column({ enum: SessionCloseReason, nullable: true })
  closeReason?: SessionCloseReason;
}
