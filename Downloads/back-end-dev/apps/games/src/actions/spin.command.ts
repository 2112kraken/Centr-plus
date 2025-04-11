import { plainToInstance } from 'class-transformer';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { AssetAmountDto } from '@common/dto/asset-amount.dto';
import { BalanceService } from '@common/modules/balance/balance.service';
import { CurrencyExchangeConvertResponse } from '@common/modules/currency-exchange/currency-exchange';
import { CurrencyExchangeService } from '@common/modules/currency-exchange/currency-exchange.service';
import { GameBetEvent, GameWinEvent } from '@common/modules/event-bus/events/game.events';
import { ProducerService } from '@common/modules/event-bus/producer.service';

import { TransactionSubType, TransactionType } from '@balance/modules/transaction/transaction.entity';

import { GameExceptionService } from '@games/common/exception/exception.service';
import { GameSession, SessionCloseReason } from '@games/modules/game/entity/game-session.entity';
import { GameService } from '@games/modules/game/game.service';

type SpinType = TransactionSubType.BET | TransactionSubType.WIN;

export class SpinCommand {
  readonly externalTransactionId: string;
  readonly externalId: string;
  readonly spinAmount: Omit<AssetAmountDto, 'currencyCode'>;
  readonly type: SpinType;

  constructor(data?: SpinCommand) {
    Object.assign(this, plainToInstance(SpinCommand, data));
  }
}

@CommandHandler(SpinCommand)
export class SpinCommandHandler implements ICommandHandler<SpinCommand, CurrencyExchangeConvertResponse> {
  constructor(
    private readonly gameService: GameService,
    private readonly gameExceptionService: GameExceptionService,
    private readonly balanceService: BalanceService,
    private readonly currencyExchangeService: CurrencyExchangeService,
    private readonly producerService: ProducerService,
  ) {}

  async execute(command: SpinCommand): Promise<CurrencyExchangeConvertResponse> {
    const session = await this.gameService.sessionRepository.findOneOrFail({
      where: { externalId: command.externalId },
    });

    const convertedSpin = await this.currencyExchangeService.convertForPlatform({
      amount: command.spinAmount.amount,
      amountCurrencyCode: session.gameCurrencyCode,
      convertedCurrencyCode: session.accountCurrencyCode,
      amountDecimals: command.spinAmount.decimals,
    });

    switch (command.type) {
      case TransactionSubType.BET:
        return this.bet(command, convertedSpin, session);

      case TransactionSubType.WIN:
        return this.win(command, convertedSpin, session);

      default:
        throw new Error(`Unsupported transaction type: ${command.type}`);
    }
  }

  private async bet(command: SpinCommand, convertedSpin: CurrencyExchangeConvertResponse, session: GameSession) {
    if (session.closeReason === SessionCloseReason.PLAYER_BLOCKED) {
      this.gameExceptionService.throw('PLAYER_BLOCKED', {
        command,
        session,
      });
    }

    if (session.closedAt) {
      this.gameExceptionService.throw('SESSION_CLOSED', { command, session });
    }

    const transaction = await this.balanceService.applyTransaction({
      type: TransactionType.OUT,
      subtype: TransactionSubType.BET,
      amount: convertedSpin.convertedAmount,
      currencyCode: convertedSpin.convertedCurrencyCode,
      playerId: session.playerId,
      accountId: session.accountId,
      externalId: command.externalTransactionId,
    });

    const convertedTransaction = await this.currencyExchangeService.convertForProvider({
      amount: transaction.account.balance,
      amountCurrencyCode: session.accountCurrencyCode,
      convertedCurrencyCode: session.gameCurrencyCode,
      convertedAmountDecimals: command.spinAmount.decimals,
    });

    await this.producerService.publish(
      new GameBetEvent({
        accountId: session.accountId,
        sessionId: session.id,
        externalTransactionId: command.externalTransactionId,
        gameId: session.gameId,
        vendorId: session.vendorId,
        balanceTransactionId: transaction.id,
        convertedSpin,
      }),
    );

    return convertedTransaction;
  }

  private async win(command: SpinCommand, convertedSpin: CurrencyExchangeConvertResponse, session: GameSession) {
    const transaction = await this.balanceService.applyTransaction({
      type: TransactionType.IN,
      subtype: TransactionSubType.WIN,
      amount: convertedSpin.convertedAmount,
      currencyCode: convertedSpin.convertedCurrencyCode,
      playerId: session.playerId,
      accountId: session.accountId,
      externalId: command.externalTransactionId,
    });

    const convertedTransaction = await this.currencyExchangeService.convertForProvider({
      amount: transaction.account.balance,
      amountCurrencyCode: session.accountCurrencyCode,
      convertedCurrencyCode: session.gameCurrencyCode,
      convertedAmountDecimals: command.spinAmount.decimals,
    });

    await this.producerService.publish(
      new GameWinEvent({
        accountId: session.accountId,
        sessionId: session.id,
        externalTransactionId: command.externalTransactionId,
        gameId: session.gameId,
        vendorId: session.vendorId,
        balanceTransactionId: transaction.id,
        convertedSpin,
      }),
    );

    return convertedTransaction;
  }
}
