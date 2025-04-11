import { Injectable } from '@nestjs/common';

import { sdk } from '@supertest/common/sdk';
import { ContactType } from '@supertest/common/sdk/operations.graphql';

import { PerformanceTest } from '../base.perftest';

let counter = 0;
const BASE_USERNAME = Date.now().toString();

@Injectable()
export class RegistrationTest implements PerformanceTest {
  readonly name = 'identity.registration';
  readonly description = 'Test user registration performance';

  async execute(): Promise<void> {
    // Use counter instead of Date.now() to avoid string operations
    const username = BASE_USERNAME + (counter++).toString().padStart(4, '0');

    await sdk.Register(
      {
        dto: {
          username,
          password: 'qweQWE123',
          contact: {
            type: ContactType.Email,
            value: `${username}@test.com`,
          },
        },
      },
      { 'x-language': 'EN' },
    );
  }
}
