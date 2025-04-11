import { IsNotEmpty, IsString } from 'class-validator';

import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ContactInput {
  @Field()
  id: string;
}

@InputType()
export class ContactBeginConfirmationDto {
  @Field(() => ContactInput)
  contact: ContactInput;
}

@InputType()
export class ContactFinishConfirmationDto {
  @Field(() => ContactInput)
  contact: ContactInput;

  @Field()
  @IsString()
  @IsNotEmpty()
  token: string;
}
