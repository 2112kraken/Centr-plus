import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CurrencyCode } from '@common/enum/currency.enum';

import { Account } from '@balance/modules/account/account.entity';

export enum TransactionType {
  IN = 'IN',
  OUT = 'OUT',
}

export enum TransactionSubType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  BET = 'BET',
  WIN = 'WIN',
  ROLLBACK = 'ROLLBACK',
  BONUS = 'BONUS',
  MANUAL = 'MANUAL',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  rollbackId?: string;

  @Column()
  playerId: string;

  @Column({ enum: TransactionType })
  type: TransactionType;

  @Column({ enum: TransactionSubType })
  subtype: TransactionSubType;

  @Column()
  amount: string;

  @Column()
  amountUsd: string;

  @Column({ enum: CurrencyCode })
  currencyCode: CurrencyCode;

  @Column()
  accountId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  rollbackAt?: Date;

  @Column()
  triggeredByAdminId?: string;

  @Column()
  externalId?: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @OneToOne(() => Transaction, (transaction) => transaction.id)
  @JoinColumn({ name: 'rollbackId' })
  rollback: Transaction;
}
