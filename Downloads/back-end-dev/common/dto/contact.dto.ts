import { IsEmail, IsPhoneNumber, ValidateIf } from 'class-validator';

import { Field, InputType, registerEnumType } from '@nestjs/graphql';

export enum ContactType {
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
}

export enum ContactStatus {
  CREATED = 'CREATED',
  VERIFIED = 'VERIFIED',
  DELETED = 'DELETED',
}

registerEnumType(ContactStatus, { name: 'ContactStatus' });
registerEnumType(ContactType, { name: 'ContactType' });

@InputType()
export class ContactDto {
  @Field(() => ContactType)
  type: ContactType;

  @Field()
  @ValidateIf((o) => o.type === ContactType.EMAIL)
  @IsEmail({}, { message: 'Invalid email address' })
  @ValidateIf((o) => o.type === ContactType.PHONE)
  @IsPhoneNumber(undefined, { message: 'Invalid phone number' })
  value: string;
}
