import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { ContactDto } from '@common/dto/contact.dto';

@InputType()
export class LoginDto {
  @Type(() => ContactDto)
  @Field(() => ContactDto)
  contact: ContactDto;

  @IsNotEmpty()
  @IsString()
  @Field()
  password: string;
}

@ObjectType()
export class LoginResponseDto {
  @IsString()
  @IsNotEmpty()
  @Field()
  accessToken: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  refreshToken: string;
}
