import { Query, Resolver } from '@nestjs/graphql';

import { UserId } from '@common/modules/security/jwt/decorators/user-id.decorator';

import { Session } from '@identity/modules/session/session.entity';
import { SessionService } from '@identity/modules/session/session.service';

@Resolver(() => Session)
export class SessionResolver {
  constructor(private readonly sessionService: SessionService) {}

  @Query(() => [Session])
  async sessions(@UserId() playerId: string) {
    return this.sessionService.sessionRepository.find({
      where: {
        playerId,
        isActive: true,
      },
    });
  }
}
