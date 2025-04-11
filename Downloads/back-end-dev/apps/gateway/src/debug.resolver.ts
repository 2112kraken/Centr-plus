import { Context, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class DebugResolver {
  @Query(() => String)
  getRequestHeaders(@Context('req') req: any) {
    return JSON.stringify(req.headers, null, 2);
  }
}
