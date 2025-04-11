import { GraphQLError } from 'graphql';
import { Redis } from 'ioredis';

import { Lang2 } from '@common/enum/lang.enum';
import { TempTokenType } from '@common/modules/security/temp-token/temp-token.service';

import { ErrorCode } from '@identity/common/exceptions/error.service';

import { sdk } from '@supertest/common/sdk';
import { ContactType } from '@supertest/common/sdk/operations.graphql';
import { generateTestPlayer } from '@supertest/common/test-helpers';
import { config } from '@supertest/config';

describe('authentication', () => {
  describe('player registration', () => {
    it('should register user successfully', async () => {
      const testUser = generateTestPlayer();
      const response = await sdk.Register({ dto: testUser }, { 'x-language': 'EN' });

      const [contact] = response.register.user.contacts;

      expect(response.register).toBeDefined();
      expect(response.register.accessToken).toBeDefined();
      expect(response.register.user).toMatchObject({
        username: testUser.username,
      });
      expect(contact).toMatchObject({
        type: ContactType.Email,
        value: contact.value,
      });
    });

    it('should throw user already exists', async () => {
      const testUser = generateTestPlayer();
      const successResponse = await sdk.Register({ dto: testUser }, { 'x-language': 'EN' });

      const duplicateContactError = await sdk
        .Register({ dto: testUser }, { 'x-language': Lang2.EN })
        .catch(({ response }) =>
          response.errors.find((err: GraphQLError) => err.extensions.code === ErrorCode.DUPLICATE_CONTACT),
        );

      const [contact] = successResponse.register.user.contacts;

      expect(successResponse.register).toBeDefined();
      expect(successResponse.register.accessToken).toBeDefined();
      expect(successResponse.register.user).toMatchObject({
        username: testUser.username,
      });
      expect(contact).toMatchObject({
        type: ContactType.Email,
        value: contact.value,
      });

      expect(duplicateContactError.extensions.code).toBe(ErrorCode.DUPLICATE_CONTACT);
    });
  });

  describe('player login', () => {
    const testUser = generateTestPlayer();

    beforeAll(async () => {
      await sdk.Register({ dto: testUser }, { 'x-language': 'EN' });
    });

    it('should successfully login by email ', async () => {
      const { login } = await sdk.Login({
        dto: {
          contact: testUser.contact,
          password: testUser.password,
        },
      });

      const [contact] = login.user.contacts;

      expect(login).toBeDefined();
      expect(login.accessToken).toBeDefined();
      expect(login.refreshToken).toBeDefined();
      expect(contact).toMatchObject(testUser.contact);
    });

    it('should throw exception WRONG_CREDENTIALS', async () => {
      const duplicateContactError = await sdk
        .Login(
          {
            dto: {
              contact: testUser.contact,
              password: 'wrong-password',
            },
          },
          { 'x-language': 'EN' },
        )
        .catch(({ response }) =>
          response.errors.find((err: GraphQLError) => err.extensions.code === ErrorCode.WRONG_CREDENTIALS),
        );

      expect(duplicateContactError.extensions.code).toBe(ErrorCode.WRONG_CREDENTIALS);
    });
  });

  describe('refresh access token', () => {
    it('should successfully refresh token', async () => {
      const testUser = generateTestPlayer();
      const { register } = await sdk.Register({ dto: testUser }, { 'x-language': 'EN' });

      const { refreshToken } = register;

      const { refreshAccessToken } = await sdk.RefreshAccessToken(undefined, {
        authorization: `Bearer ${refreshToken}`,
      });

      const { player } = await sdk.Player(undefined, {
        authorization: `Bearer ${refreshAccessToken.accessToken}`,
      });

      expect(player.contacts.at(0)?.value).toBe(testUser.contact.value);
    });
  });

  describe('confirm contact', () => {
    let redisClient: Redis;

    beforeAll(async () => {
      redisClient = new Redis(config.redis.url);
    });

    afterAll(async () => {
      await redisClient.quit();
    });

    it('should begin contact confirmation', async () => {
      const testUser = generateTestPlayer();
      const { accessToken, user } = await sdk
        .Register({ dto: testUser }, { 'x-language': 'EN' })
        .then((res) => res.register);

      const contact = user.contacts.at(0)!;

      const { beginContactConfirmation } = await sdk.BeginContactConfirmation(
        { dto: { contact: { id: contact.id } } },
        { authorization: `Bearer ${accessToken}` },
      );

      const token = await redisClient
        .get(`token:${TempTokenType.CONFIRM_CONTACT}:${user.id}:${contact.value}`)
        .then((rawJson) => JSON.parse(rawJson || '{}'));

      const { finishContactConfirmation } = await sdk.FinishContactConfirmation(
        { dto: { token: token.value, contact: { id: contact.id } } },
        { authorization: `Bearer ${accessToken}` },
      );

      expect(token).toBeDefined();
      expect(beginContactConfirmation.expireAt).toBeDefined();
      expect(finishContactConfirmation.verifiedAt).toBeDefined();
    });
  });
});
