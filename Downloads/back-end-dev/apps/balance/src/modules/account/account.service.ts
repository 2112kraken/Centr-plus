import { QueryFailedError, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';

import { TtLogger } from '@app/logger';

import { Account } from '@balance/modules/account/account.entity';
import { AccountApplyTransactionDto } from '@balance/modules/account/dto/account-apply-transaction.dto';
import { TransactionType } from '@balance/modules/transaction/transaction.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    readonly accountRepository: Repository<Account>,
    private readonly logger: TtLogger,
  ) {}

  async updateBalance(
    params: Pick<AccountApplyTransactionDto, 'playerId' | 'amount' | 'currencyCode' | 'type'>,
  ): Promise<Account> {
    const { playerId, amount, currencyCode } = params;
    const operator = params.type === TransactionType.IN ? '+' : '-';

    // Direct SQL for better performance, avoiding query builder overhead
    return this.accountRepository
      .query(
        /*sql*/ `UPDATE account 
       SET balance = balance ${operator} $1,
           "updatedAt" = CURRENT_TIMESTAMP
       WHERE "playerId" = $2 AND "currencyCode" = $3
       RETURNING *`,
        [amount, playerId, currencyCode],
      )
      .then(([rows]) => rows[0])
      .catch((err) => {
        if (err instanceof QueryFailedError && err.driverError.constraint === 'account_balance_check') {
          throw new RpcException('INSUFFICIENT_FUNDS');
        }

        this.logger.error({
          msg: 'Error updating account balance',
          err,
          data: { params },
        });

        throw err;
      });
  }
}
