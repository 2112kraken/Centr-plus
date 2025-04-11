import { Lang2 } from '@common/enum/lang.enum';

import { sdk } from '@supertest/common/sdk';
import { generateTestPlayerInfo, generateTestPlayer } from '@supertest/common/test-helpers';

describe('player info', () => {
  const testPlayerInfo = generateTestPlayerInfo();
  let accessToken: string;

  beforeEach(async () => {
    const testPlayer = generateTestPlayer();
    const { register } = await sdk.Register({ dto: testPlayer }, { 'x-language': Lang2.EN });

    accessToken = register.accessToken;
  });

  it('should successfully set player info', async () => {
    const { setPlayerInfo } = await sdk.SetPlayerInfo(
      { dto: testPlayerInfo },
      { authorization: `Bearer ${accessToken}` },
    );

    expect(testPlayerInfo).toStrictEqual(setPlayerInfo);
  });

  it('should successfully get player info', async () => {
    await sdk.SetPlayerInfo({ dto: testPlayerInfo }, { authorization: `Bearer ${accessToken}` });
    const { player } = await sdk.Player(undefined, {
      authorization: `Bearer ${accessToken}`,
    });

    expect(player.info).toStrictEqual(testPlayerInfo);
  });
});
