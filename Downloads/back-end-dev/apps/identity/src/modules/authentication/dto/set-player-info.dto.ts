import { IsString, IsOptional, IsDate } from 'class-validator';

import { Field, InputType } from '@nestjs/graphql';

import { PlayerInfo } from '@identity/modules/user/entities/player-info.entity';

@InputType()
export class SetPlayerInfoDto
  implements Omit<PlayerInfo, 'id' | 'country' | 'player' | 'language' | 'createdAt' | 'updatedAt'>
{
  @Field()
  @IsString()
  firstName: string;

  @Field()
  @IsString()
  lastName: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  middleName?: string;

  @Field({ nullable: true })
  @IsDate()
  dateOfBirth: Date;

  @Field({ nullable: true })
  @IsString()
  countryCode: string;

  @Field({ nullable: true })
  @IsString()
  city: string;

  @Field({ nullable: true })
  @IsString()
  address: string;
}
