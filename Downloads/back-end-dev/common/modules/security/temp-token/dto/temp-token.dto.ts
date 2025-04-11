import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TempTokenResponseDto {
  @Field()
  expireAt: number;
}
