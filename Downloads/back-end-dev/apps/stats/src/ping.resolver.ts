import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class PingResolver {
  @Query(() => String)
  pingStats(): string {
    return 'pong';
  }
}
