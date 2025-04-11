import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Jackpot {
  @PrimaryGeneratedColumn()
  jackpotId: number;

  @Column()
  amount: string;
}
