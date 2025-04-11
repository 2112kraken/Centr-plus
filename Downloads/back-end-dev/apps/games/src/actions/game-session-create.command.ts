import { plainToInstance } from 'class-transformer';
import { randomUUID } from 'crypto';
import { firstValueFrom } from 'rxjs';

import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';

import { getMessagePatternFromDto } from '@app/nest-dto-rpc';

import { CurrencyCode } from '@common/enum/currency.enum';
import { Lang2 } from '@common/enum/lang.enum';
import { RpcClient } from '@common/modules/rpc/service-name.enum';

import { Account } from '@balance/modules/account/account.entity';
import { AccountCreateIfNotExistsDto } from '@balance/modules/account/dto/account-create-if-not-exists.dto';

import { GameExceptionService } from '@games/common/exception/exception.service';
import { GameStatus } from '@games/modules/game/entity/game.entity';
import { GameService } from '@games/modules/game/game.service';
import type { LaunchGameDto } from '@games/providers/dto/launch-game.dto';

export class GameSessionCreateCommand implements LaunchGameDto {
  readonly playerId: string;
  readonly gameCode: string;
  readonly accountCurrencyCode: CurrencyCode;
  readonly gameCurrencyCode: CurrencyCode;
  readonly lang?: Lang2 = Lang2.EN;
  readonly externalId?: string = randomUUID();
  readonly activatedAt?: Date = new Date();

  constructor(data?: GameSessionCreateCommand) {
    if (data) {
      Object.assign(this, plainToInstance(GameSessionCreateCommand, data));
    }
  }
}

@CommandHandler(GameSessionCreateCommand)
export class GameSessionCreateCommandHandler {
  constructor(
    @Inject(RpcClient.BALANCE)
    private readonly balanceRpcClient: ClientProxy,
    private readonly gameService: GameService,
    private readonly gameExceptionService: GameExceptionService,
  ) {}

  async execute(command: GameSessionCreateCommand) {
    const { playerId, externalId, accountCurrencyCode, gameCurrencyCode, gameCode } = command;

    const game = await this.gameService.gameRepository.findOne({
      where: { code: gameCode },
      relations: ['provider', 'vendor'],
    });

    if (!game || game.deletedAt || game.status !== GameStatus.ENABLED) {
      this.gameExceptionService.throw('GAME_NOT_FOUND', { gameCode });
    }

    const account = await firstValueFrom(
      this.balanceRpcClient.send<Account, AccountCreateIfNotExistsDto>(
        getMessagePatternFromDto(AccountCreateIfNotExistsDto),
        { playerId, currencyCode: accountCurrencyCode },
      ),
    );

    return this.gameService.sessionRepository.save(
      this.gameService.sessionRepository.create({
        game,
        playerId,
        accountCurrencyCode,
        gameCurrencyCode,
        externalId,
        provider: game.provider,
        vendor: game.vendor,
        accountId: account.id,
        activatedAt: command.activatedAt,
      }),
    );
  }
}
