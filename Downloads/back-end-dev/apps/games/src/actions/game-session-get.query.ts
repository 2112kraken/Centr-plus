import { plainToInstance } from 'class-transformer';

import { QueryHandler } from '@nestjs/cqrs';

import { GameExceptionService } from '@games/common/exception/exception.service';
import { GameService } from '@games/modules/game/game.service';

export class SessionGetActiveQuery {
  readonly externalId: string;

  constructor(data?: SessionGetActiveQuery) {
    if (data) {
      Object.assign(this, plainToInstance(SessionGetActiveQuery, data));
    }
  }
}

@QueryHandler(SessionGetActiveQuery)
export class SessionGetActiveQueryHandler {
  constructor(
    private readonly gameService: GameService,
    private readonly gameExceptionService: GameExceptionService,
  ) {}

  async execute(command: SessionGetActiveQuery) {
    const { externalId } = command;

    const session = await this.gameService.sessionRepository.findOne({
      where: { externalId },
      relations: ['game', 'provider', 'vendor'],
    });

    if (!session) {
      this.gameExceptionService.throw('SESSION_NOT_FOUND', {
        command,
        session,
      });
    }

    if (session.closedAt) {
      this.gameExceptionService.throw('SESSION_CLOSED', {
        command,
        session,
      });
    }

    return session;
  }
}
