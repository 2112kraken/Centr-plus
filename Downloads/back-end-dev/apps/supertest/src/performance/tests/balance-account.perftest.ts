import { firstValueFrom } from 'rxjs';
import { Transaction } from 'typeorm';

import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { getMessagePatternFromDto } from '@app/nest-dto-rpc';

import { CurrencyCode } from '@common/enum/currency.enum';
import { RpcClient } from '@common/modules/rpc/service-name.enum';

import { Account } from '@balance/modules/account/account.entity';
import { AccountApplyTransactionDto } from '@balance/modules/account/dto/account-apply-transaction.dto';
import { AccountCreateIfNotExistsDto } from '@balance/modules/account/dto/account-create-if-not-exists.dto';
import { TransactionSubType, TransactionType } from '@balance/modules/transaction/transaction.entity';

import { PerformanceTest } from '../base.perftest';
import { generateRandomId } from '../utils/random';

@Injectable()
export class BalanceAccountTest implements PerformanceTest {
  readonly name = 'deposit';
  readonly description = 'Test balance account creation performance';
  readonly account: Promise<Account>;

  constructor(
    @Inject(RpcClient.BALANCE)
    private readonly balanceRpcClient: ClientProxy,
  ) {
    this.account = firstValueFrom(
      this.balanceRpcClient.send<Account, AccountCreateIfNotExistsDto>(
        getMessagePatternFromDto(AccountCreateIfNotExistsDto),
        { currencyCode: CurrencyCode.USDT, playerId: generateRandomId(1, 1000000) },
      ),
    );
  }

  async execute(): Promise<void> {
    const account = await this.account;
    await firstValueFrom(
      this.balanceRpcClient.send<Transaction, AccountApplyTransactionDto>(
        getMessagePatternFromDto(AccountApplyTransactionDto),
        {
          amount: '100',
          currencyCode: CurrencyCode.USDT,
          playerId: account.playerId,
          accountId: account.id,
          subtype: TransactionSubType.DEPOSIT,
          type: TransactionType.IN,
        },
      ),
    );
  }
}
