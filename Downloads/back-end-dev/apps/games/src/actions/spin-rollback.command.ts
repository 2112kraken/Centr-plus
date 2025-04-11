import { plainToInstance } from 'class-transformer';
import { firstValueFrom } from 'rxjs';

import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';

import { TtLogger } from '@app/logger';
import { getMessagePatternFromDto } from '@app/nest-dto-rpc';

import { CurrencyExchangeService } from '@common/modules/currency-exchange/currency-exchange.service';
import { GameRollbackEvent } from '@common/modules/event-bus/events/game.events';
import { ProducerService } from '@common/modules/event-bus/producer.service';
import { RpcClient } from '@common/modules/rpc/service-name.enum';

import { AccountRollbackTransactionCommand } from '@balance/actions/account-rollback-transaction.command';
import { AccountRollbackTransactionResponseDto } from '@balance/modules/account/dto/account-transaction-rollback.dto';

import { GameExceptionService } from '@games/common/exception/exception.service';
import { GameService } from '@games/modules/game/game.service';

export class SpinRollbackCommand {
  readonly externalTransactionId: string;
  readonly externalSessionId: string;
  readonly responseBalanceDecimals: number;

  constructor(data: SpinRollbackCommand) {
    if (data) {
      Object.assign(this, plainToInstance(SpinRollbackCommand, data));
    }
  }
}

@CommandHandler(SpinRollbackCommand)
export class SpinRollbackCommandHandler implements ICommandHandler<SpinRollbackCommand> {
  constructor(
    @Inject(RpcClient.BALANCE)
    private readonly balanceRpcClient: ClientProxy,
    private readonly gameService: GameService,
    private readonly currencyExchangeService: CurrencyExchangeService,
    private readonly gameExceptionService: GameExceptionService,
    private readonly producerService: ProducerService,
    private readonly logger: TtLogger,
  ) {}

  async execute(command: SpinRollbackCommand) {
    const session = await this.gameService.sessionRepository.findOne({
      where: { externalId: command.externalSessionId },
      select: { id: true, gameId: true, vendorId: true, accountCurrencyCode: true, gameCurrencyCode: true },
    });

    if (!session) {
      throw this.gameExceptionService.throw('SESSION_NOT_FOUND', { command });
    }

    const { transaction, account, duplicate } = await firstValueFrom(
      this.balanceRpcClient.send<AccountRollbackTransactionResponseDto, AccountRollbackTransactionCommand>(
        getMessagePatternFromDto(AccountRollbackTransactionCommand),
        { transactionId: command.externalTransactionId },
      ),
    );

    const convertedSpin = await this.gameService.gameTransactionRepository
      .findOneOrFail({ where: { externalTransactionId: command.externalTransactionId } })
      .then((gameTransaction) =>
        this.currencyExchangeService.convertForPlatform({
          amount: gameTransaction.amount,
          amountCurrencyCode: session.gameCurrencyCode,
          convertedCurrencyCode: session.accountCurrencyCode,
          amountDecimals: gameTransaction.amountDecimals,
        }),
      );

    const responseBalance = this.currencyExchangeService.convertForProvider({
      amount: account.balance,
      amountCurrencyCode: session.accountCurrencyCode,
      convertedCurrencyCode: session.gameCurrencyCode,
      convertedAmountDecimals: command.responseBalanceDecimals,
    });

    if (duplicate) {
      this.logger.warn({
        data: { command, session, transaction },
        msg: 'Duplicate transaction rollback',
      });

      return responseBalance;
    }

    await this.producerService.publish(
      new GameRollbackEvent({
        convertedSpin,
        accountId: transaction.accountId,
        balanceTransactionId: transaction.id,
        externalTransactionId: command.externalTransactionId,
        gameId: session.gameId,
        sessionId: session.id,
        vendorId: session.vendorId,
      }),
    );

    return responseBalance;
  }
}
