import { plainToInstance } from 'class-transformer';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { AccountService } from '@balance/modules/account/account.service';
import { AccountCreateIfNotExistsDto } from '@balance/modules/account/dto/account-create-if-not-exists.dto';

export class AccountCreateIfNotExistsCommand extends AccountCreateIfNotExistsDto {
  constructor(data: AccountCreateIfNotExistsCommand) {
    super();

    if (data) {
      Object.assign(this, plainToInstance(AccountCreateIfNotExistsCommand, data));
    }
  }
}

@CommandHandler(AccountCreateIfNotExistsCommand)
export class AccountCreateIfNotExistsCommandHandler implements ICommandHandler<AccountCreateIfNotExistsCommand> {
  constructor(private readonly accountService: AccountService) {}

  async execute(params: AccountCreateIfNotExistsCommand) {
    const account = await this.accountService.accountRepository.findOne({
      where: { playerId: params.playerId, currencyCode: params.currencyCode },
    });

    if (account) {
      return account;
    }

    return this.accountService.accountRepository.save(
      this.accountService.accountRepository.create({
        balance: '0',
        name: params.currencyCode,
        currencyCode: params.currencyCode,
        playerId: params.playerId,
      }),
    );
  }
}
