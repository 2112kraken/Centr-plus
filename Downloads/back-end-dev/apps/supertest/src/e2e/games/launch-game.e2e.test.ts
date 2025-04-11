import { Lang2 } from '@common/enum/lang.enum';

import { sdk } from '@supertest/common/sdk';
import { CurrencyCode } from '@supertest/common/sdk/operations.graphql';
import { generateTestPlayer } from '@supertest/common/test-helpers';

describe('games', () => {
  let accessToken: string;

  beforeEach(async () => {
    const testPlayer = generateTestPlayer();
    const { register } = await sdk.Register({ dto: testPlayer }, { 'x-language': Lang2.EN });

    accessToken = register.accessToken;
  });

  it('should successfully launch game and return launch url', async () => {
    const { launchGame: gameLaunchUrl } = await sdk.LaunchGame(
      {
        dto: {
          gameCode: 'test-slot-game',
          accountCurrencyCode: CurrencyCode.Btc,
          gameCurrencyCode: CurrencyCode.Usd,
        },
      },
      { authorization: `Bearer ${accessToken}` },
    );

    expect(gameLaunchUrl).toBeTruthy();
  });
});
