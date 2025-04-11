import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class PingResolver {
  @Query(() => String)
  pingScheduler(): string {
    return 'pong';
  }
}
