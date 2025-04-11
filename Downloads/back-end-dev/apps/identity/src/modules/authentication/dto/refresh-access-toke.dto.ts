import { IsNotEmpty, IsString } from 'class-validator';

import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RefreshAccessTokenDto {
  @IsNotEmpty()
  @IsString()
  @Field()
  accessToken: string;
}
