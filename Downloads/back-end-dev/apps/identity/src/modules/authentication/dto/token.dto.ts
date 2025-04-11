import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TokenDto {
  @Field(() => Int)
  sub: number;

  @Field(() => Int)
  iat: number;

  @Field(() => Int)
  exp: number;
}
