import { Module } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class HelloResolver {
  @Query(() => String)
  helloWorld(): string {
    return 'Hello, World!';
  }
}

@Module({
  providers: [HelloResolver],
})
export class NotificationModule {}
