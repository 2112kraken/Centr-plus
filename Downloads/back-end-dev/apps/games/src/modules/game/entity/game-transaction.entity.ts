import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CurrencyCode } from '@common/enum/currency.enum';

import { GameProvider } from './game-provider.entity';
import { GameVendor } from './game-vendor.entity';
import { Game } from './game.entity';
import { Jackpot } from './jackpot.entity';
import { GameSession } from './game-session.entity';

@Entity()
export class GameTransaction {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ type: 'bigint' })
  sessionId: string;

  @Column({ type: 'bigint' })
  balanceTransactionId: string;

  @Column()
  externalTransactionId: string;

  @Column()
  accountId: string;

  @Column({ nullable: true })
  roundId: string;

  @Column({ nullable: true })
  vendorId: number;

  @Column({ nullable: true })
  providerId: number;

  @Column({ nullable: true })
  gameId: number;

  @Column({ nullable: true, enum: CurrencyCode })
  currencyCode: CurrencyCode;

  @Column({ type: 'numeric', nullable: true })
  rate: string;

  @Column()
  type: string;

  @Column({ type: 'numeric' })
  amount: string;

  @Column({ type: 'int2' })
  amountDecimals: number;

  @Column({ nullable: true })
  jackpotId: number;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => GameSession)
  @JoinColumn({ name: 'sessionId' })
  session: GameSession;

  @ManyToOne(() => GameVendor)
  @JoinColumn({ name: 'vendorId' })
  vendor: GameVendor;

  @ManyToOne(() => GameProvider)
  @JoinColumn({ name: 'providerId' })
  provider: GameProvider;

  @ManyToOne(() => Game)
  @JoinColumn({ name: 'gameId' })
  game: Game;

  @ManyToOne(() => Jackpot)
  @JoinColumn({ name: 'jackpotId' })
  jackpot: Jackpot;
}
