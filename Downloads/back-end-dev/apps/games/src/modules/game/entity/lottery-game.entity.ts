import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { Game } from './game.entity';

@Entity()
export class LotteryGame {
  @PrimaryColumn()
  gameId: number;

  @Column({ type: 'int2', nullable: true })
  ticketPriceUsd: number;

  @Column({ type: 'int2', nullable: true })
  maxPrizeUsd: number;

  @OneToOne(() => Game)
  @JoinColumn({ name: 'gameId' })
  game: Game;
}
