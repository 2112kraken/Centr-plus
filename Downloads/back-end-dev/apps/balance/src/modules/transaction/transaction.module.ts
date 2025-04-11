import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Transaction } from '@balance/modules/transaction/transaction.entity';
import { TransactionService } from '@balance/modules/transaction/transaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
