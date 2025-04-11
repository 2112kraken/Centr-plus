import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CurrencyExchangeModule } from '@common/modules/currency-exchange/currency-exchange.module';

import { AccountApplyTransactionCommandHandler } from '@balance/actions/account-apply-transaction.command';
import { AccountCreateIfNotExistsCommandHandler } from '@balance/actions/account-create-if-not-exists.command';
import { AccountGetQueryHandler } from '@balance/actions/account-get.query';
import { AccountRollbackTransactionCommandHandler } from '@balance/actions/account-rollback-transaction.command';
import { AccountController } from '@balance/modules/account/account.controller';
import { Account } from '@balance/modules/account/account.entity';
import { AccountResolver } from '@balance/modules/account/account.resolver';
import { AccountService } from '@balance/modules/account/account.service';
import { TransactionModule } from '@balance/modules/transaction/transaction.module';

const CommandHandlers = [
  AccountApplyTransactionCommandHandler,
  AccountCreateIfNotExistsCommandHandler,
  AccountRollbackTransactionCommandHandler,
];

const QueryHandlers = [AccountGetQueryHandler];

@Module({
  imports: [TypeOrmModule.forFeature([Account]), CqrsModule, TransactionModule, CurrencyExchangeModule],
  controllers: [AccountController],
  providers: [AccountService, AccountResolver, ...CommandHandlers, ...QueryHandlers],
  exports: [AccountService],
})
export class AccountModule {}
