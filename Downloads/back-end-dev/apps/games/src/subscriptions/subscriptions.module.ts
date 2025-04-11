import { Module } from '@nestjs/common';

import { GameModule } from '@games/modules/game/game.module';
import { GameSubscriptions } from '@games/subscriptions/game.sibscriptions';

@Module({
  imports: [GameModule],
  controllers: [GameSubscriptions],
})
export class SubscriptionsModule {}
