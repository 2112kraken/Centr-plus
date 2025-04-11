import { plainToInstance } from 'class-transformer';
import { Transactional } from 'typeorm-transactional';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CurrencyCode } from '@common/enum/currency.enum';
import { CurrencyExchangeService } from '@common/modules/currency-exchange/currency-exchange.service';

import { AccountService } from '@balance/modules/account/account.service';
import { AccountApplyTransactionDto } from '@balance/modules/account/dto/account-apply-transaction.dto';
import { Transaction } from '@balance/modules/transaction/transaction.entity';
import { TransactionService } from '@balance/modules/transaction/transaction.service';

export class AccountApplyTransactionCommand extends AccountApplyTransactionDto {
  constructor(data: AccountApplyTransactionCommand) {
    super();

    if (data) {
      Object.assign(this, plainToInstance(AccountApplyTransactionCommand, data));
    }
  }
}

@CommandHandler(AccountApplyTransactionCommand)
export class AccountApplyTransactionCommandHandler
  implements ICommandHandler<AccountApplyTransactionCommand, Transaction>
{
  constructor(
    private readonly accountService: AccountService,
    private readonly transactionService: TransactionService,
    private readonly currencyExchangeService: CurrencyExchangeService,
  ) {}

  @Transactional()
  async execute(command: AccountApplyTransactionCommand) {
    const [transaction, account] = await Promise.all([
      this.createTransaction(command),
      this.accountService.updateBalance(command),
    ]);

    transaction.account = account;

    return transaction;
  }

  private async createTransaction(command: AccountApplyTransactionCommand) {
    const convertedAmountUsd = this.currencyExchangeService.convert({
      amount: command.amount,
      amountCurrencyCode: command.currencyCode,
      convertedCurrencyCode: CurrencyCode.USD,
      amountDecimals: 18,
      convertedAmountDecimals: 18,
    });

    // Direct SQL for better performance, avoiding query builder overhead
    const [transaction]: Transaction[] = await this.transactionService.transactionRepository.query(
      /*sql*/ `INSERT INTO transaction(
          "playerId", "type", "subtype", "amount", "amountUsd",
          "currencyCode", "accountId", "externalId"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
      [
        command.playerId,
        command.type,
        command.subtype,
        command.amount,
        convertedAmountUsd.convertedAmount,
        command.currencyCode,
        command.accountId,
        command.externalId || null,
      ],
    );

    return transaction;
  }
}
