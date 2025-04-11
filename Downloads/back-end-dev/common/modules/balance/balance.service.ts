import { firstValueFrom } from 'rxjs';

import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { getMessagePatternFromDto } from '@app/nest-dto-rpc';

import { RpcClient } from '@common/modules/rpc/service-name.enum';

import { AccountApplyTransactionDto } from '@balance/modules/account/dto/account-apply-transaction.dto';
import type { Transaction } from '@balance/modules/transaction/transaction.entity';

@Injectable()
export class BalanceService {
  constructor(
    @Inject(RpcClient.BALANCE)
    private readonly balanceRpcClient: ClientProxy,
  ) {}

  async applyTransaction(dto: AccountApplyTransactionDto) {
    return firstValueFrom(
      this.balanceRpcClient.send<Transaction, AccountApplyTransactionDto>(
        getMessagePatternFromDto(AccountApplyTransactionDto),
        dto,
      ),
    );
  }
}
