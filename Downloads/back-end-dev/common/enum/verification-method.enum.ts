import { registerEnumType } from '@nestjs/graphql';

export enum VerificationMethod {
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  TWO_FACTOR_AUTH = 'TWO_FACTOR_AUTH',
}

registerEnumType(VerificationMethod, { name: 'VerificationMethod' });
