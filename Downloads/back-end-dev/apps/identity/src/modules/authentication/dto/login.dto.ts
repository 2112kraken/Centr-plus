import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';

import { ContactDto } from '@common/dto/contact.dto';
import { Lang2 } from '@common/enum/lang.enum';

import { Player } from '@identity/modules/user/entities/player.entity';

@InputType()
export class LoginContactDto extends PickType(ContactDto, ['type', 'value'], InputType) {}

@InputType()
export class LoginDto {
  @Type(() => LoginContactDto)
  @Field(() => LoginContactDto)
  contact: LoginContactDto;

  @IsNotEmpty()
  @IsString()
  @Field()
  password: string;
}

export class RequestExtraDto {
  userAgent: string;
  ipAddress: string;
  lang2: Lang2;
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

  @Type(() => Player)
  @ValidateNested()
  @Field(() => Player)
  user: Player;
}
