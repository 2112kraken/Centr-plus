import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CurrencyExchangeModule } from '@common/modules/currency-exchange/currency-exchange.module';

import { GameSession } from '@games/modules/game/entity/game-session.entity';
import { GameTransaction } from '@games/modules/game/entity/game-transaction.entity';
import { Game } from '@games/modules/game/entity/game.entity';
import { GameService } from '@games/modules/game/game.service';

@Module({
  imports: [TypeOrmModule.forFeature([GameSession, Game, GameTransaction]), CurrencyExchangeModule],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
