import { ArgsType, Field, InputType, Int, ObjectType } from '@nestjs/graphql';

import { Player } from '@adminpanel/modules/user/player/entity/player.entity';

@InputType()
export class GetPlayersFilterDto {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  status?: string;
}

@InputType()
export class PaginationDto {
  @Field({ defaultValue: 1 })
  page: number;

  @Field({ defaultValue: 10 })
  limit: number;
}

@ArgsType()
export class GetPlayersDto {
  @Field(() => GetPlayersFilterDto, { nullable: true, defaultValue: {} })
  filter: GetPlayersFilterDto;

  @Field(() => PaginationDto, {
    nullable: true,
    defaultValue: { page: 1, limit: 10 },
  })
  pagination: PaginationDto;
}

@ObjectType()
export class GetPlayersResponseDto {
  @Field(() => [Player])
  data: Player[];

  @Field(() => Int)
  total: number;
}
