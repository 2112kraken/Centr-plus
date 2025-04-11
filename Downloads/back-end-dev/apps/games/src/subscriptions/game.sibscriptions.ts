import { Controller, UseFilters } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';

import { TtLogger } from '@app/logger';
import { EventPatternDto } from '@app/nest-dto-rpc/decorators';

import { GameBetEvent, GameRollbackEvent, GameWinEvent } from '@common/modules/event-bus/events/game.events';
import { PlayerBlockedEvent } from '@common/modules/event-bus/events/player.events';

import { SessionCloseReason } from '@games/modules/game/entity/game-session.entity';
import { GameService } from '@games/modules/game/game.service';
import { GameEventsExceptionFilter } from '@games/subscriptions/game-events.catch';

@Controller()
@UseFilters(GameEventsExceptionFilter)
export class GameSubscriptions {
  constructor(
    private readonly gameService: GameService,
    private readonly logger: TtLogger,
  ) {}

  @EventPatternDto(GameBetEvent)
  async onGameBetEvent(@Payload() event: GameBetEvent) {
    return this.gameService.saveGameBetStats(event);
  }

  @EventPatternDto(GameWinEvent)
  async onGameWinEvent(@Payload() event: GameWinEvent) {
    return this.gameService.saveGameWinStats(event);
  }

  @EventPatternDto(GameRollbackEvent)
  async onGameRollbackEvent(@Payload() event: GameRollbackEvent) {
    return this.gameService.saveGameRollbackStats(event);
  }

  @EventPatternDto(PlayerBlockedEvent)
  async onPlayerBlockedEvent(@Payload() event: PlayerBlockedEvent) {
    this.logger.debug({ data: event, msg: 'Player blocked event' });
    await this.gameService.terminateActiveSessions({
      closedAt: new Date(),
      playerId: event.playerId,
      closeReason: SessionCloseReason.PLAYER_BLOCKED,
    });
  }
}
