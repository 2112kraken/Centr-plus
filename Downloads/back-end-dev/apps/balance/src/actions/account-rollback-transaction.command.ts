import { plainToInstance } from 'class-transformer';
import { Transactional } from 'typeorm-transactional';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Helpers } from '@common/libs/helper.lib';

import { AccountService } from '@balance/modules/account/account.service';
import {
  AccountRollbackTransactionDto,
  AccountRollbackTransactionResponseDto,
} from '@balance/modules/account/dto/account-transaction-rollback.dto';
import { TransactionSubType, TransactionType } from '@balance/modules/transaction/transaction.entity';
import { TransactionService } from '@balance/modules/transaction/transaction.service';

export class AccountRollbackTransactionCommand extends AccountRollbackTransactionDto {
  constructor(data?: AccountRollbackTransactionCommand) {
    super();

    if (data) {
      Object.assign(this, plainToInstance(AccountRollbackTransactionCommand, data));
    }
  }
}

@CommandHandler(AccountRollbackTransactionCommand)
export class AccountRollbackTransactionCommandHandler
  implements ICommandHandler<AccountRollbackTransactionCommand, AccountRollbackTransactionResponseDto>
{
  constructor(
    private readonly accountService: AccountService,
    private readonly transactionService: TransactionService,
  ) {}

  @Transactional()
  async execute(command: AccountRollbackTransactionCommand): Promise<AccountRollbackTransactionResponseDto> {
    const transactionToRollback = await this.transactionService.transactionRepository.findOne({
      where: { externalId: command.transactionId },
    });

    if (!transactionToRollback) {
      throw new Error('Transaction not found');
    }

    if (transactionToRollback.rollbackAt) {
      return {
        duplicate: true,
        transaction: transactionToRollback,
        account: await this.accountService.accountRepository.findOneByOrFail({
          playerId: transactionToRollback.playerId,
        }),
      };
    }

    const type = transactionToRollback.type === TransactionType.IN ? TransactionType.OUT : TransactionType.IN;
    const transaction = await this.transactionService.transactionRepository.save(
      {
        ...Helpers.omit(transactionToRollback, [
          'id',
          'externalId',
          'createdAt',
          'updatedAt',
          'rollbackId',
          'rollbackAt',
        ]),
        type,
        subtype: TransactionSubType.ROLLBACK,
      },
      { reload: true },
    );

    transactionToRollback.rollbackId = transaction.id;
    transactionToRollback.rollback = transaction;
    transactionToRollback.rollbackAt = new Date();
    await this.transactionService.transactionRepository.save(transactionToRollback);

    const account = await this.accountService.updateBalance(transaction);

    return {
      transaction: transactionToRollback,
      account,
    };
  }
}
