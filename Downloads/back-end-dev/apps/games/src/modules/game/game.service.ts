import Big from 'bignumber.js';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ClientProxy } from '@app/nest-dto-rpc';

import { CurrencyCode } from '@common/enum/currency.enum';
import { CurrencyExchangeService } from '@common/modules/currency-exchange/currency-exchange.service';
import { GameBetEvent, GameWinEvent, GameRollbackEvent } from '@common/modules/event-bus/events/game.events';
import { RpcClient } from '@common/modules/rpc/service-name.enum';

import { GameSession } from '@games/modules/game/entity/game-session.entity';
import { GameTransaction } from '@games/modules/game/entity/game-transaction.entity';
import { Game } from '@games/modules/game/entity/game.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameSession)
    readonly sessionRepository: Repository<GameSession>,

    @InjectRepository(Game)
    readonly gameRepository: Repository<Game>,

    @InjectRepository(GameTransaction)
    readonly gameTransactionRepository: Repository<GameTransaction>,

    @Inject(RpcClient.BALANCE)
    private readonly balanceRpcClient: ClientProxy,
    private readonly currencyExchangeService: CurrencyExchangeService,
  ) {}

  async terminateActiveSessions(data: Required<Pick<GameSession, 'playerId' | 'closedAt' | 'closeReason'>>) {
    const { playerId, closedAt, closeReason } = data;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await this.sessionRepository
      .createQueryBuilder('game_session')
      .update()
      .where('game_session."playerId" = :playerId', { playerId })
      .andWhere('game_session."createdAt" >= :today', { today })
      .andWhere('game_session."closedAt" IS NULL')
      .set({
        closedAt,
        closeReason,
      })
      .execute();
  }

  @Transactional()
  async saveGameBetStats(event: GameBetEvent): Promise<void> {
    const { sessionId, balanceTransactionId, externalTransactionId, accountId, gameId, vendorId, convertedSpin } =
      event;

    const spinAmountUsd = this.currencyExchangeService.convert({
      amount: convertedSpin.convertedAmount,
      amountCurrencyCode: convertedSpin.convertedCurrencyCode,
      convertedCurrencyCode: CurrencyCode.USD,
      amountDecimals: convertedSpin.convertedAmountDecimals,
      convertedAmountDecimals: 18,
    });

    // Create and save game transaction
    await this.gameTransactionRepository.save({
      sessionId,
      balanceTransactionId,
      externalTransactionId,
      accountId,
      gameId,
      vendorId,
      type: 'BET',
      amount: convertedSpin.amount,
      amountDecimals: convertedSpin.amountDecimals,
      currencyCode: convertedSpin.amountCurrencyCode,
      rate: convertedSpin.rate,
      createdAt: new Date(),
    });

    const betAmount = Big(convertedSpin.convertedAmount).shiftedBy(-convertedSpin.convertedAmountDecimals).toString();
    const betAmountUsd = Big(spinAmountUsd.convertedAmount)
      .shiftedBy(-spinAmountUsd.convertedAmountDecimals)
      .toString();

    // Update session totals
    await this.sessionRepository
      .createQueryBuilder()
      .update()
      .where('id = :sessionId', { sessionId })
      .set({
        totalBet: () => `"totalBet" + :betAmount::numeric`,
        totalBetUsd: () => `"totalBetUsd" + :betAmountUsd::numeric`,
        totalBetCount: () => `"totalBetCount" + 1`,
        lastBetAt: new Date(),
      })
      .setParameters({
        betAmount,
        betAmountUsd,
      })
      .execute();
  }

  @Transactional()
  async saveGameWinStats(event: GameWinEvent): Promise<void> {
    const { sessionId, balanceTransactionId, externalTransactionId, accountId, gameId, vendorId, convertedSpin } =
      event;

    const spinAmountUsd = this.currencyExchangeService.convert({
      amount: convertedSpin.convertedAmount,
      amountCurrencyCode: convertedSpin.convertedCurrencyCode,
      convertedCurrencyCode: CurrencyCode.USD,
      amountDecimals: convertedSpin.convertedAmountDecimals,
      convertedAmountDecimals: 18,
    });

    // Create and save game transaction
    await this.gameTransactionRepository.save({
      sessionId,
      balanceTransactionId,
      externalTransactionId,
      accountId,
      gameId,
      vendorId,
      type: 'WIN',
      amount: convertedSpin.amount,
      amountDecimals: convertedSpin.amountDecimals,
      currencyCode: convertedSpin.amountCurrencyCode,
      rate: convertedSpin.rate,
      createdAt: new Date(),
    });

    const winAmount = Big(convertedSpin.convertedAmount).shiftedBy(-convertedSpin.convertedAmountDecimals).toString();
    const winAmountUsd = Big(spinAmountUsd.convertedAmount)
      .shiftedBy(-spinAmountUsd.convertedAmountDecimals)
      .toString();

    // Update session totals
    await this.sessionRepository
      .createQueryBuilder()
      .update()
      .where('id = :sessionId', { sessionId })
      .set({
        totalWin: () => `"totalWin" + :winAmount::numeric`,
        totalWinUsd: () => `"totalWinUsd" + :winAmountUsd::numeric`,
        totalWinCount: () => `"totalWinCount" + 1`,
      })
      .setParameters({
        winAmount,
        winAmountUsd,
      })
      .execute();
  }

  @Transactional()
  async saveGameRollbackStats(event: GameRollbackEvent): Promise<void> {
    const { sessionId, balanceTransactionId, externalTransactionId, accountId, gameId, vendorId, convertedSpin } =
      event;

    const spinAmountUsd = this.currencyExchangeService.convert({
      amount: convertedSpin.convertedAmount,
      amountCurrencyCode: convertedSpin.convertedCurrencyCode,
      convertedCurrencyCode: CurrencyCode.USD,
      amountDecimals: convertedSpin.convertedAmountDecimals,
      convertedAmountDecimals: 18,
    });

    // Create and save game transaction
    await this.gameTransactionRepository.save({
      sessionId,
      balanceTransactionId,
      externalTransactionId,
      accountId,
      gameId,
      vendorId,
      type: 'ROLLBACK',
      amount: convertedSpin.amount,
      amountDecimals: convertedSpin.amountDecimals,
      currencyCode: convertedSpin.amountCurrencyCode,
      rate: convertedSpin.rate,
      createdAt: new Date(),
    });

    const rollbackAmount = Big(convertedSpin.convertedAmount)
      .shiftedBy(-convertedSpin.convertedAmountDecimals)
      .toString();
    const rollbackAmountUsd = Big(spinAmountUsd.convertedAmount)
      .shiftedBy(-spinAmountUsd.convertedAmountDecimals)
      .toString();

    // Update session totals
    await this.sessionRepository
      .createQueryBuilder()
      .update()
      .where('id = :sessionId', { sessionId })
      .set({
        totalRollback: () => `"totalRollback" + :rollbackAmount::numeric`,
        totalRollbackUsd: () => `"totalRollbackUsd" + :rollbackAmountUsd::numeric`,
        totalRollbackCount: () => `"totalRollbackCount" + 1`,
      })
      .setParameters({
        rollbackAmount,
        rollbackAmountUsd,
      })
      .execute();
  }
}
