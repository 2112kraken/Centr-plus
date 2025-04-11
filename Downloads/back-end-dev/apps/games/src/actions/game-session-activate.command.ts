import { plainToInstance } from 'class-transformer';

import { CommandHandler } from '@nestjs/cqrs';

import { GameExceptionService } from '@games/common/exception/exception.service';
import { GameStatus } from '@games/modules/game/entity/game.entity';
import { GameService } from '@games/modules/game/game.service';

export class GameSessionActivateCommand {
  readonly externalId: string;
  readonly newExternalId?: string;
  readonly gameCode?: string;
  readonly playerId?: string;

  constructor(data?: GameSessionActivateCommand) {
    if (data) {
      Object.assign(this, plainToInstance(GameSessionActivateCommand, data));
    }
  }
}

@CommandHandler(GameSessionActivateCommand)
export class GameSessionActivateCommandHandler {
  constructor(
    private readonly gameService: GameService,
    private readonly gameExceptionService: GameExceptionService,
  ) {}

  async execute(command: GameSessionActivateCommand) {
    const { externalId } = command;

    const session = await this.gameService.sessionRepository.findOneOrFail({
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

    if (!session.game || session.game.deletedAt) {
      this.gameExceptionService.throw('GAME_NOT_FOUND', {
        command,
        session,
      });
    }

    if (session.game.status !== GameStatus.ENABLED) {
      this.gameExceptionService.throw('GAME_DISABLED', {
        command,
        session,
      });
    }

    if (command.gameCode && session.game.code !== command.gameCode) {
      this.gameExceptionService.throw('SESSION_NOT_FOUND', {
        command,
        session,
        reason: 'Game code mismatch',
      });
    }

    if (command.playerId && session.playerId !== command.playerId) {
      this.gameExceptionService.throw('SESSION_NOT_FOUND', {
        command,
        session,
        missingPlayerId: true,
      });
    }

    if (command.newExternalId) {
      session.externalId = command.newExternalId;
    }

    return this.gameService.sessionRepository.save({
      ...session,
      activatedAt: new Date(),
    });
  }
}
