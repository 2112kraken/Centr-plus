import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class PingResolver {
  @Query(() => String)
  pingGamification(): string {
    return 'pong';
  }
}
