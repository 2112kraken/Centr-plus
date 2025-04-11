import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class PingResolver {
  @Query(() => String)
  pingPsp(): string {
    return 'pong';
  }
}
