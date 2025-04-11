import { firstValueFrom } from 'rxjs';

import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';

import { getMessagePatternFromDto } from '@app/nest-dto-rpc';

import { Lang2 } from '@common/enum/lang.enum';
import { InfinConfig } from '@common/modules/config/configs';
import { RpcClient } from '@common/modules/rpc/service-name.enum';

import { GetPlayerByIdDto } from '@identity/modules/user/dto/get-player-by-id.dto';
import { Player } from '@identity/modules/user/entities/player.entity';

import { GameSessionCreateCommand } from '@games/actions/game-session-create.command';
import { ProviderCode } from '@games/modules/game/entity/game-provider.entity';
import { GameSession } from '@games/modules/game/entity/game-session.entity';
import { LaunchGameDto } from '@games/providers/dto/launch-game.dto';

export interface GameLaunchParams {
  session: GameSession;
  lang?: string;
  exitURL?: string;
  cashierURL?: string;
}

@Injectable()
export class ProvidersService {
  constructor(
    @Inject(RpcClient.IDENTITY)
    private readonly identityRpcClient: ClientProxy,
    private readonly commandBus: CommandBus,
    private readonly infinConfig: InfinConfig,
  ) {}

  async launchGame(playerId: string, dto: LaunchGameDto): Promise<string> {
    const player = await firstValueFrom(
      this.identityRpcClient.send<Player, GetPlayerByIdDto>(getMessagePatternFromDto(GetPlayerByIdDto), {
        playerId,
      }),
    );

    if (!player.isActive) {
      throw new ForbiddenException('Player is blocked');
    }

    const session = await this.commandBus.execute<GameSessionCreateCommand, GameSession>(
      new GameSessionCreateCommand({ ...dto, playerId }),
    );

    return this.createLaunchUrl({ session, lang: Lang2.EN });
  }

  createLaunchUrl(params: GameLaunchParams): string {
    switch (params.session.provider.code) {
      case ProviderCode.INFIN:
        const url = new URL('infin', this.infinConfig.launchUrlHost);
        url.searchParams.append('gameName', params.session.game.name);
        url.searchParams.append('key', params.session.externalId);
        url.searchParams.append('partner', 'infin');
        url.searchParams.append('lang', params.lang || 'en');
        url.searchParams.append('exitURL', params.exitURL || '');
        url.searchParams.append('cashierURL', params.cashierURL || '');

        return url.toString();
      default:
        throw new Error(`Provider ${params.session.provider.code} not supported`);
    }
  }
}
