import { plainToInstance } from 'class-transformer';

import { EventDto } from '@app/nest-dto-rpc';

import { CurrencyExchangeConvertResponse } from '@common/modules/currency-exchange/currency-exchange';

class GameEvent {
  readonly accountId: string;
  readonly gameId: number;
  readonly vendorId: number;
  readonly balanceTransactionId: string;
  readonly externalTransactionId: string;
  readonly sessionId: string;
  readonly convertedSpin: CurrencyExchangeConvertResponse;

  constructor(data: GameBetEvent) {
    if (data) {
      Object.assign(this, plainToInstance(GameBetEvent, data));
    }
  }
}

@EventDto('game.bet')
export class GameBetEvent extends GameEvent {}

@EventDto('game.win')
export class GameWinEvent extends GameEvent {}

@EventDto('game.rollback')
export class GameRollbackEvent extends GameEvent {}
