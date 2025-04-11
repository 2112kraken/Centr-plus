import Big from 'bignumber.js';
import { randomUUID } from 'crypto';
import { firstValueFrom } from 'rxjs';
import { Transaction } from 'typeorm';

import { Inject, Injectable } from '@nestjs/common';

import { ClientProxy, getMessagePatternFromDto } from '@app/nest-dto-rpc';

import { Lang2 } from '@common/enum/lang.enum';
import { RpcClient } from '@common/modules/rpc/service-name.enum';

import { Account } from '@balance/modules/account/account.entity';
import { AccountApplyTransactionDto } from '@balance/modules/account/dto/account-apply-transaction.dto';
import { AccountCreateIfNotExistsDto } from '@balance/modules/account/dto/account-create-if-not-exists.dto';
import { TransactionSubType, TransactionType } from '@balance/modules/transaction/transaction.entity';

import { sdk } from '@supertest/common/sdk';
import { CurrencyCode } from '@supertest/common/sdk/operations.graphql';
import { generateTestPlayer, getPlayerIdFromAccessToken } from '@supertest/common/test-helpers';

import { PerformanceTest } from '../base.perftest';

@Injectable()
export class InfinTest implements PerformanceTest {
  readonly name = 'infin';
  readonly description = 'Test infin performance';
  private guid: string;
  private readonly gameCode = 'test-slot-game';
  private account: Account;

  constructor(
    @Inject(RpcClient.BALANCE)
    private readonly balanceRpcClient: ClientProxy,
  ) {}

  async setup(): Promise<void> {
    const testPlayer = generateTestPlayer();
    const { register } = await sdk.Register({ dto: testPlayer }, { 'x-language': Lang2.EN });
    const accessToken = register.accessToken;
    const playerId = getPlayerIdFromAccessToken(accessToken);

    this.account = await firstValueFrom(
      this.balanceRpcClient.send<Account, AccountCreateIfNotExistsDto>(
        getMessagePatternFromDto(AccountCreateIfNotExistsDto),
        { playerId, currencyCode: CurrencyCode.Usdt as any },
      ),
    );

    await firstValueFrom(
      this.balanceRpcClient.send<Transaction, AccountApplyTransactionDto>(
        getMessagePatternFromDto(AccountApplyTransactionDto),
        {
          amount: Big(1000).shiftedBy(18).toString(),
          currencyCode: CurrencyCode.Usdt as any,
          playerId,
          accountId: this.account.id,
          subtype: TransactionSubType.DEPOSIT,
          type: TransactionType.IN,
        },
      ),
    );

    const { launchGame } = await sdk.LaunchGame(
      {
        dto: {
          accountCurrencyCode: CurrencyCode.Usdt,
          gameCurrencyCode: CurrencyCode.Usd,
          gameCode: this.gameCode,
        },
      },
      { authorization: `Bearer ${accessToken}` },
    );

    this.guid = new URL(launchGame).searchParams.get('key') as string;

    await fetch(`http://localhost:3005/infin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/xml' },
      body: /*xml*/ `
      <server session="DEADBEEF" time="${new Date().toISOString()}">
        <enter id="${randomUUID()}" guid="${this.guid}" key="${this.guid}">
          <game name="${this.gameCode}"></game>
        </enter>
      </server>
    `,
    });
  }

  async execute(): Promise<void> {
    const createRoundXml = (
      actionTag: 'roundbet' | 'roundwin',
      amountAttr: 'bet' | 'win',
      guid: string,
      accountId: string,
      amount: string,
    ): string => {
      return /*xml*/ `
        <server session="DEADBEEF" time="${new Date().toISOString()}">
          <${actionTag} id="${randomUUID()}" guid="${guid}" wlid="USD-${accountId}" ${amountAttr}="${amount}" type="qwe" finished="false">
            <game name="${this.gameCode}"></game>
            <roundnum id="${randomUUID()}"></roundnum>
          </${actionTag}>
        </server>
      `;
    };

    await fetch(`http://localhost:3005/infin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/xml' },
      body: createRoundXml('roundbet', 'bet', this.guid, this.account.id, '1'),
    });

    await fetch(`http://localhost:3005/infin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/xml' },
      body: createRoundXml('roundwin', 'win', this.guid, this.account.id, '1000'),
    });
  }
}
