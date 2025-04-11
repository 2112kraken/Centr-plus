import { Lang2 } from '@common/enum/lang.enum';

import { adminSdk } from '@supertest/common/admin-sdk';
import { sdk } from '@supertest/common/sdk';
import { generateTestPlayer, generateTestPlayerInfo } from '@supertest/common/test-helpers';

describe('players', () => {
  let accessToken: string;

  beforeAll(async () => {
    const testPlayerInfo = generateTestPlayerInfo();
    const testPlayer = generateTestPlayer();
    const { register } = await sdk.Register({ dto: testPlayer }, { 'x-language': Lang2.EN });

    accessToken = register.accessToken;

    await sdk.SetPlayerInfo({ dto: testPlayerInfo }, { authorization: `Bearer ${accessToken}` });
  });

  it('should return players successfully', async () => {
    const response = await adminSdk.Players();
    expect(response.players).toBeDefined();
  });
});
