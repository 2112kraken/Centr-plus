import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { AccessTokenRequired, UserId } from '@common/modules/security/jwt/decorators/user-id.decorator';

import { LaunchGameDto } from '@games/providers/dto/launch-game.dto';
import { ProvidersService } from '@games/providers/providers.service';

@Resolver()
export class ProvidersResolver {
  constructor(private readonly providerService: ProvidersService) {}

  @AccessTokenRequired()
  @Mutation(() => String)
  async launchGame(@UserId() playerId: string, @Args('dto') dto: LaunchGameDto) {
    return this.providerService.launchGame(playerId, dto);
  }
}
