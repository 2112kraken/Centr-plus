import { plainToInstance } from 'class-transformer';

import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { Account } from '@balance/modules/account/account.entity';
import { AccountService } from '@balance/modules/account/account.service';
import { AccountGetDto } from '@balance/modules/account/dto/account-get.dto';

export class AccountGetQuery extends AccountGetDto {
  constructor(data: AccountGetQuery) {
    super();

    if (data) {
      Object.assign(this, plainToInstance(AccountGetQuery, data));
    }
  }
}

@QueryHandler(AccountGetQuery)
export class AccountGetQueryHandler implements IQueryHandler<AccountGetQuery, Account> {
  constructor(private readonly accountService: AccountService) {}

  async execute(query: AccountGetQuery) {
    return this.accountService.accountRepository.findOneOrFail({
      where: { id: query.accountId },
    });
  }
}
