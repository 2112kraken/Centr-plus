import Big from 'bignumber.js';
import { randomUUID } from 'node:crypto';
import { setTimeout } from 'node:timers/promises';
import { firstValueFrom } from 'rxjs';
import { Transaction } from 'typeorm';

import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';

import { getMessagePatternFromDto } from '@app/nest-dto-rpc';

import { AmountDecimals } from '@common/dto/asset-amount.dto';
import { Lang2 } from '@common/enum/lang.enum';
import { XML } from '@common/libs/xml-parser.lib';
import { RpcClient } from '@common/modules/rpc/service-name.enum';
import { UserScope } from '@common/modules/security/jwt/enum/user-scope.enum';

import { BlockUserByIdRpcDto } from '@identity/modules/user/dto/block-user-by-id.dto';

import { Account } from '@balance/modules/account/account.entity';
import { AccountApplyTransactionDto } from '@balance/modules/account/dto/account-apply-transaction.dto';
import { AccountCreateIfNotExistsDto } from '@balance/modules/account/dto/account-create-if-not-exists.dto';
import { TransactionSubType, TransactionType } from '@balance/modules/transaction/transaction.entity';

import { sdk } from '@supertest/common/sdk';
import { CurrencyCode } from '@supertest/common/sdk/operations.graphql';
import { generateTestPlayer, getPlayerIdFromAccessToken } from '@supertest/common/test-helpers';
import { config } from '@supertest/config';

describe('infin', () => {
  let accessToken: string;
  let balanceRpcClient: ClientProxy;
  let identityRpcClient: ClientProxy;
  let playerId: string;
  const TEST_AMOUNT = '0.00113658'; // 100 USD in BTC
  const accountCurrencyCode = CurrencyCode.Btc as any;
  const gameCurrencyCode = CurrencyCode.Usd as any;
  const game = { id: 1, code: 'test-slot-game' };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ClientsModule.registerAsync({
          clients: [
            {
              name: RpcClient.BALANCE,
              useFactory: () => ({
                transport: Transport.TCP,
                options: config.service.balance.tcp,
              }),
            },
            {
              name: RpcClient.IDENTITY,
              useFactory: () => ({
                transport: Transport.TCP,
                options: config.service.identity.tcp,
              }),
            },
          ],
        }),
      ],
    }).compile();
    balanceRpcClient = moduleRef.get<ClientProxy>(RpcClient.BALANCE);
    identityRpcClient = moduleRef.get<ClientProxy>(RpcClient.IDENTITY);
  });

  beforeEach(async () => {
    const testPlayer = generateTestPlayer();
    const { register } = await sdk.Register({ dto: testPlayer }, { 'x-language': Lang2.EN });
    accessToken = register.accessToken;
    playerId = getPlayerIdFromAccessToken(accessToken);
  });

  afterAll(async () => {
    await balanceRpcClient.close();
    await identityRpcClient.close();
  });

  describe('Enter', () => {
    it('should allow a player to enter a game', async () => {
      const sessionId = randomUUID();
      const launchKey = await launchGame();
      const enterResponse = await infinRequest(createEnterXml(launchKey, sessionId));
      expect(getValue(enterResponse)).toBe('0');
    });
  });

  describe('Bet', () => {
    it('should process a bet transaction', async () => {
      const sessionId = randomUUID();
      const account = await createAccountAndDeposit();
      const launchKey = await launchGame();
      await infinRequest(createEnterXml(launchKey, sessionId));
      const betResponse = await infinRequest(createRoundXml('roundbet', 'bet', sessionId, account.id, '1000'));
      expect(getValue(betResponse)).toBe('9000');
    });

    it('should throw not enough money', async () => {
      const sessionId = randomUUID();
      const account = await createAccountAndDeposit();
      const launchKey = await launchGame();
      await infinRequest(createEnterXml(launchKey, sessionId));
      const betResponse = await infinRequest(createRoundXml('roundbet', 'bet', sessionId, account.id, '10001'));
      expect(betResponse.service.roundbet.error['@code']).toBe('NOT_ENOUGH_MONEY');
    });

    it('should throw error player blocked', async () => {
      const sessionId = randomUUID();
      const account = await createAccountAndDeposit();
      const launchKey = await launchGame();
      await infinRequest(createEnterXml(launchKey, sessionId));
      await infinRequest(createRoundXml('roundbet', 'bet', sessionId, account.id, '1000'));
      await infinRequest(createRoundXml('roundwin', 'win', sessionId, account.id, '1000'));

      await firstValueFrom(
        identityRpcClient.send<void, BlockUserByIdRpcDto>(getMessagePatternFromDto(BlockUserByIdRpcDto), {
          userId: playerId,
          scope: UserScope.PLAYER,
          reason: 'test block',
        }),
        // wait 1 second to ensure the block is processed
      ).finally(() => setTimeout(1000));

      const betResponse = await infinRequest(createRoundXml('roundbet', 'bet', sessionId, account.id, '1000'));
      expect(betResponse.service.roundbet.error['@code']).toBe('USER_BLOCKED');
    });
  });

  describe('Win', () => {
    it('should process a win transaction', async () => {
      const sessionId = randomUUID();
      const account = await createAccountAndDeposit();
      const launchKey = await launchGame();
      await infinRequest(createEnterXml(launchKey, sessionId));
      const winResponse = await infinRequest(createRoundXml('roundwin', 'win', sessionId, account.id, '1000'));
      expect(getValue(winResponse)).toBe('11000');
    });
  });

  describe('Rollback', () => {
    it('should rollback bet transaction', async () => {
      const sessionId = randomUUID();
      const account = await createAccountAndDeposit();
      const launchKey = await launchGame();
      await infinRequest(createEnterXml(launchKey, sessionId));
      const betResponse = await infinRequest(createRoundXml('roundbet', 'bet', sessionId, account.id, '1000'));
      const rollbackResponse = await infinRequest(
        createRollbackXml(account.id, sessionId, betResponse.service.roundbet['@id']),
      );

      const rollbackDuplicateResponse = await infinRequest(
        createRollbackXml(account.id, sessionId, betResponse.service.roundbet['@id']),
      );
      expect(getValue(betResponse)).toBe('9000');
      expect(getValue(rollbackResponse)).toBe('10000');
      expect(getValue(rollbackDuplicateResponse)).toBe('10000');
    });
  });

  describe('Balance', () => {
    it('should return the correct balance', async () => {
      const sessionId = randomUUID();
      const account = await createAccountAndDeposit();
      const launchKey = await launchGame();
      await infinRequest(createEnterXml(launchKey, sessionId));
      const balanceResponse = await infinRequest(createBalanceXml(account.id));
      expect(getValue(balanceResponse)).toBe('10000');
    });
  });

  describe('ReEnter', () => {
    it('should reenter session', async () => {
      const sessionId = randomUUID();
      const newSessionId = randomUUID();
      const account = await createAccountAndDeposit();
      const launchKey = await launchGame();
      const enterResponse = await infinRequest(createEnterXml(launchKey, sessionId));
      const reEnterResponse = await infinRequest(createReEnterXml(sessionId, newSessionId));
      const betResponse = await infinRequest(createRoundXml('roundbet', 'bet', sessionId, account.id, '1000'));
      expect(getValue(betResponse)).toBe('9000');
      expect(getValue(enterResponse)).toBe('10000');
      expect(getValue(reEnterResponse)).toBe('10000');
    });
  });

  async function createAccountAndDeposit(): Promise<Account> {
    const account = await firstValueFrom(
      balanceRpcClient.send<Account, AccountCreateIfNotExistsDto>(
        getMessagePatternFromDto(AccountCreateIfNotExistsDto),
        { playerId, currencyCode: accountCurrencyCode },
      ),
    );

    await firstValueFrom(
      balanceRpcClient.send<Transaction, AccountApplyTransactionDto>(
        getMessagePatternFromDto(AccountApplyTransactionDto),
        {
          amount: Big(TEST_AMOUNT).shiftedBy(AmountDecimals.NATIVE).toFixed(),
          currencyCode: accountCurrencyCode,
          playerId: account.playerId,
          accountId: account.id,
          subtype: TransactionSubType.DEPOSIT,
          type: TransactionType.IN,
        },
      ),
    );
    return account;
  }

  async function infinRequest(body: string): Promise<Record<string, any>> {
    const url = `http://${config.service.games.http.host}:${config.service.games.http.port}/infin`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/xml' },
      body,
    });
    const rawXml = await res.text();
    return XML.parse(rawXml);
  }

  function getValue(infinResponse: Record<string, any>): string | null {
    const { enter, roundbet, roundwin, getbalance, 're-enter': reenter, refund } = infinResponse.service;
    if (enter) return enter.balance['@value'];
    if (roundbet) return roundbet.balance['@value'];
    if (roundwin) return roundwin.balance['@value'];
    if (getbalance) return getbalance.balance['@value'];
    if (getbalance) return getbalance.balance['@value'];
    if (reenter) return reenter.balance['@value'];
    if (refund) return refund.balance['@value'];
    return null;
  }

  async function launchGame(): Promise<string> {
    const { launchGame } = await sdk.LaunchGame(
      {
        dto: {
          accountCurrencyCode,
          gameCurrencyCode,
          gameCode: game.code,
        },
      },
      { authorization: `Bearer ${accessToken}` },
    );
    return new URL(launchGame).searchParams.get('key') as string;
  }

  function createReEnterXml(guid: string, newGuid: string): string {
    return /*xml*/ `
      <server session="DEADBEEF" time="2021-01-01T00:00:00.000Z">
          <re-enter id="${randomUUID}" guid="${guid}" new-guid="${newGuid}" wlid="${playerId}-${gameCurrencyCode}">
              <game name="${game.code}"></game>
          </re-enter>
      </server>
    `;
  }

  function createEnterXml(launchKey: string, guid: string): string {
    return /*xml*/ `
      <server session="DEADBEEF" time="${new Date().toISOString()}">
        <enter id="${randomUUID()}" guid="${guid}" key="${launchKey}">
          <game name="${game.code}"></game>
        </enter>
      </server>
    `;
  }

  function createRoundXml(
    actionTag: 'roundbet' | 'roundwin',
    amountAttr: 'bet' | 'win',
    guid: string,
    accountId: string,
    amount: string,
  ): string {
    return /*xml*/ `
      <server session="DEADBEEF" time="${new Date().toISOString()}">
        <${actionTag} id="${randomUUID()}" guid="${guid}" wlid="${accountId}-${gameCurrencyCode}" ${amountAttr}="${amount}" type="qwe" finished="false">
          <game name="${game.code}"></game>
          <roundnum id="${randomUUID()}"></roundnum>
        </${actionTag}>
      </server>
    `;
  }

  function createBalanceXml(accountId: string): string {
    return /*xml*/ `
      <server session="DEADBEEF" time="2021-01-01T00:00:00.000Z">
        <getbalance id="${randomUUID()}" wlid="${accountId}-${gameCurrencyCode}"></getbalance>
      </server>
    `;
  }

  function createRollbackXml(accountId: string, guid: string, rollbackTransactionId: string): string {
    return /*xml*/ `
      <server session="DEADBEEF" time="${new Date().toISOString()}">
          <refund id="${randomUUID()}" guid="${guid}" wlid="${accountId}-${gameCurrencyCode}" cash="0">
              <storno cmd="roundbet" id="${rollbackTransactionId}" wlid="${accountId}-${gameCurrencyCode}" guid="${rollbackTransactionId}" gameid="${game.code}" cash="0">
                  <roundnum id="${randomUUID()}"></roundnum>
              </storno>
          </refund>
      </server>
    `;
  }
});
