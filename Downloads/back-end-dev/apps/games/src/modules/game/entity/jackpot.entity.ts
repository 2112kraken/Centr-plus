import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Jackpot {
  @PrimaryGeneratedColumn()
  jackpotId: number;

  @Column({ type: 'numeric', precision: 32, scale: 2 })
  amount: string;
}
