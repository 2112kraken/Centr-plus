import { Module } from '@nestjs/common';

import { BalanceModule } from '@common/modules/balance/balance.module';
import { CurrencyExchangeModule } from '@common/modules/currency-exchange/currency-exchange.module';

import { GameSessionActivateCommandHandler } from '@games/actions/game-session-activate.command';
import { GameSessionCreateCommandHandler } from '@games/actions/game-session-create.command';
import { SessionGetActiveQueryHandler } from '@games/actions/game-session-get.query';
import { SpinRollbackCommandHandler } from '@games/actions/spin-rollback.command';
import { SpinCommandHandler } from '@games/actions/spin.command';
import { GameExceptionModule } from '@games/common/exception/exception.module';
import { GameModule } from '@games/modules/game/game.module';
import { PingResolver } from '@games/ping.resolver';
import { ProvidersModule } from '@games/providers/providers.module';
import { SubscriptionsModule } from '@games/subscriptions/subscriptions.module';

@Module({
  imports: [
    CurrencyExchangeModule,
    BalanceModule,
    SubscriptionsModule,
    ProvidersModule,
    GameExceptionModule,
    GameModule,
  ],
  providers: [
    PingResolver,
    SpinCommandHandler,
    SpinRollbackCommandHandler,
    SessionGetActiveQueryHandler,
    GameSessionCreateCommandHandler,
    GameSessionActivateCommandHandler,
  ],
})
export class GamesModule {}
