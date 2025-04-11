import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Payload } from '@nestjs/microservices';

import { MessagePatternDto } from '@app/nest-dto-rpc';

import { AccountApplyTransactionCommand } from '@balance/actions/account-apply-transaction.command';
import { AccountCreateIfNotExistsCommand } from '@balance/actions/account-create-if-not-exists.command';
import { AccountGetQuery } from '@balance/actions/account-get.query';
import { AccountRollbackTransactionCommand } from '@balance/actions/account-rollback-transaction.command';
import { AccountApplyTransactionDto } from '@balance/modules/account/dto/account-apply-transaction.dto';
import { AccountCreateIfNotExistsDto } from '@balance/modules/account/dto/account-create-if-not-exists.dto';
import { AccountGetDto } from '@balance/modules/account/dto/account-get.dto';
import { AccountRollbackTransactionDto } from '@balance/modules/account/dto/account-transaction-rollback.dto';

@Controller()
export class AccountController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @MessagePatternDto(AccountGetDto)
  async getAccount(@Payload() dto: AccountGetDto) {
    const query = new AccountGetQuery(dto);
    return this.queryBus.execute(query);
  }

  @MessagePatternDto(AccountCreateIfNotExistsDto)
  async createIfNotExists(@Payload() dto: AccountCreateIfNotExistsDto) {
    const command = new AccountCreateIfNotExistsCommand(dto);
    return this.commandBus.execute(command);
  }

  @MessagePatternDto(AccountApplyTransactionDto)
  async applyTransaction(@Payload() dto: AccountApplyTransactionDto) {
    const command = new AccountApplyTransactionCommand(dto);
    return this.commandBus.execute(command);
  }

  @MessagePatternDto(AccountRollbackTransactionDto)
  async rollbackTransaction(@Payload() dto: AccountRollbackTransactionDto) {
    const command = new AccountRollbackTransactionCommand(dto);
    return this.commandBus.execute(command);
  }
}
