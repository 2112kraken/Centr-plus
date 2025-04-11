import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { AccessTokenRequired, UserId } from '@common/modules/security/jwt/decorators/user-id.decorator';

import { SetPlayerInfoDto } from '@identity/modules/authentication/dto/set-player-info.dto';
import { PlayerContact } from '@identity/modules/user/entities/player-contact.entity';
import { PlayerInfo } from '@identity/modules/user/entities/player-info.entity';
import { Player } from '@identity/modules/user/entities/player.entity';
import { UserService } from '@identity/modules/user/user.service';

@Resolver(() => Player)
export class PlayerResolver {
  constructor(private readonly userService: UserService) {}

  @AccessTokenRequired()
  @ResolveField(() => PlayerInfo, { nullable: true })
  async info(@Parent() player: Player) {
    if (!player.infoId) {
      return null;
    }

    return this.userService.playerInfoRepository.findOne({
      where: { id: player.infoId },
    });
  }

  @AccessTokenRequired()
  @ResolveField(() => [PlayerContact])
  async contacts(@Parent() player: Player) {
    return this.userService.playerContactRepository.find({
      where: { playerId: player.id },
    });
  }

  @AccessTokenRequired()
  @Query(() => Player)
  async player(@UserId() id: string) {
    return this.userService.playerRepository.findOneOrFail({
      where: { id },
    });
  }

  @AccessTokenRequired()
  @Mutation(() => PlayerInfo)
  async setPlayerInfo(@UserId() id: string, @Args('dto') info: SetPlayerInfoDto) {
    return this.userService.setPlayerInfo(id, info);
  }
}
