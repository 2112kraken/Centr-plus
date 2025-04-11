import { Type } from 'class-transformer';
import { IsString, IsStrongPassword } from 'class-validator';

import { Field, InputType } from '@nestjs/graphql';

import { ContactDto } from '@common/dto/contact.dto';

@InputType()
export class RegisterDto {
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
  })
  @Field()
  password: string;

  @IsString()
  @Field()
  username: string;

  @Type(() => ContactDto)
  @Field(() => ContactDto)
  contact: ContactDto;
}
