import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class PingResolver {
  @Query(() => String)
  ping2(): string {
    return 'pong';
  }
}
