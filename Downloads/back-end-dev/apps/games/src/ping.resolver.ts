import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class PingResolver {
  @Query(() => String)
  pingGames(): string {
    return 'pong';
  }
}
