import { Lang2 } from '@common/enum/lang.enum';

import { adminSdk } from '@supertest/common/admin-sdk';
import { generateTestAdmin } from '@supertest/common/test-helpers';

describe('authentication', () => {
  describe('admin registration', () => {
    it('should register user successfully', async () => {
      const testUser = generateTestAdmin();
      const response = await adminSdk.Register({ dto: testUser }, { 'x-language': 'EN' });

      expect(response.register).toBeDefined();
      expect(response.register.accessToken).toBeDefined();
    });

    it('should throw user already exists', async () => {
      const testUser = generateTestAdmin();

      const successResponse = await adminSdk.Register({ dto: testUser }, { 'x-language': 'EN' });

      const duplicateContactError = await adminSdk
        .Register({ dto: testUser }, { 'x-language': Lang2.EN })
        .catch(({ response }) => response.errors.at(0));

      expect(successResponse.register).toBeDefined();
      expect(successResponse.register.accessToken).toBeDefined();

      expect(duplicateContactError).toBeTruthy();
    });
  });

  describe('admin login', () => {
    const testUser = generateTestAdmin();

    beforeAll(async () => {
      await adminSdk.Register({ dto: testUser }, { 'x-language': 'EN' });
    });

    it('should successfully login by email ', async () => {
      const { login } = await adminSdk.Login({
        dto: {
          contact: testUser.contact,
          password: testUser.password,
        },
      });

      expect(login).toBeDefined();
      expect(login.accessToken).toBeDefined();
      expect(login.refreshToken).toBeDefined();
    });

    it('should throw exception WRONG_CREDENTIALS', async () => {
      const duplicateContactError = await adminSdk
        .Login(
          {
            dto: {
              contact: testUser.contact,
              password: 'wrong-password',
            },
          },
          { 'x-language': 'EN' },
        )
        .catch(({ response }) => response.errors.at(0));

      expect(duplicateContactError).toBeTruthy();
    });
  });
});
