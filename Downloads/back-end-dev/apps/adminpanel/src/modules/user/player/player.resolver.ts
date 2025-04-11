import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { ContactType } from '@common/dto/contact.dto';

import { DataLoaderFactory } from '@adminpanel/common/data-loader';
import { GetPlayersDto, GetPlayersResponseDto } from '@adminpanel/modules/user/player/dto/get-players.dto';
import { PlayerContact } from '@adminpanel/modules/user/player/entity/player-contact.entity';
import { PlayerInfo } from '@adminpanel/modules/user/player/entity/player-info.entity';
import { Player } from '@adminpanel/modules/user/player/entity/player.entity';
import { PlayerService } from '@adminpanel/modules/user/player/player.service';

@Resolver(() => Player)
export class PlayerResolver {
  private readonly playerInfoLoader;
  private readonly playerContactLoader;

  constructor(
    private readonly playerService: PlayerService,
    dataLoaderFactory: DataLoaderFactory,
  ) {
    this.playerInfoLoader = dataLoaderFactory.createLoader(this.playerService.playerInfoRepository);

    this.playerContactLoader = dataLoaderFactory.createLoaderMany(
      this.playerService.playerContactRepository,
      'playerId',
    );
  }

  @ResolveField(() => PlayerInfo, { nullable: true })
  async info(@Parent() player: Player) {
    if (!player.infoId) {
      return null;
    }

    return this.playerInfoLoader.load(player.infoId);
  }

  @ResolveField(() => [PlayerContact])
  async contacts(@Parent() player: Player) {
    return this.playerContactLoader.load(player.id);
  }

  @Query(() => GetPlayersResponseDto)
  async players(@Args() args: GetPlayersDto): Promise<GetPlayersResponseDto> {
    const { filter, pagination } = args;

    const qb = this.playerService.playerRepository
      .createQueryBuilder('player')
      .leftJoin('player.contacts', 'contact')
      .take(pagination.limit)
      .skip((pagination.page - 1) * pagination.limit);

    if (filter.id) {
      qb.andWhere('player.id = :id', { id: filter.id });
    }

    if (filter.username) {
      qb.andWhere('player.username LIKE :username', {
        username: `%${filter.username}%`,
      });
    }

    if (filter.email) {
      qb.andWhere(
        '( (contact.value LIKE :email AND contact.type = :emailType) OR (contact.value LIKE :phone AND contact.type = :phoneType) )',
        {
          email: `%${filter.email}%`,
          emailType: ContactType.EMAIL,
          phone: `%${filter.phone}%`,
          phoneType: ContactType.PHONE,
        },
      );
    }

    if (filter.phone) {
      qb.andWhere('contact.value LIKE :phone AND contact.type = :phoneType', {
        phone: `%${filter.phone}%`,
        phoneType: ContactType.PHONE,
      });
    }

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
    };
  }
}
