import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

import { Field, InputType } from '@nestjs/graphql';

import { ContactDto } from '@common/dto/contact.dto';

import { IsPassword } from '@identity/common/decorators/is-password.decorator';

@InputType()
export class PasswordBeginResetDto {
  @Field({ nullable: true })
  twoFactorCode: string;

  @Type(() => ContactDto)
  @Field(() => ContactDto)
  contact: ContactDto;
}

@InputType()
export class PasswordFinishResetDto extends PasswordBeginResetDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  token: string;

  @Field()
  @IsPassword()
  newPassword: string;
}
