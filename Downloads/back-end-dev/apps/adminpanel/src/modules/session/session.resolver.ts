import { Query, Resolver } from '@nestjs/graphql';

import { Session } from '@adminpanel/modules/session/session.entity';

@Resolver(() => Session)
export class SessionResolver {
  constructor() {}

  @Query(() => [Session])
  async sessions() {
    return [];
  }
}
