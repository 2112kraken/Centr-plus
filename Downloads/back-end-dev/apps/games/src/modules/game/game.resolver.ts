import { Resolver } from '@nestjs/graphql';

import { Game } from '@games/modules/game/entity/game.entity';
import { GameService } from '@games/modules/game/game.service';

@Resolver(() => Game)
export class GameResolver {
  constructor(private readonly gameService: GameService) {}
}
