import Big from 'bignumber.js';
import { firstValueFrom } from 'rxjs';

import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';

import { getMessagePatternFromDto } from '@app/nest-dto-rpc';

import { AmountDecimals } from '@common/dto/asset-amount.dto';
import { CurrencyCode } from '@common/enum/currency.enum';
import { RpcClient } from '@common/modules/rpc/service-name.enum';

import { Account } from '@balance/modules/account/account.entity';
import { AccountApplyTransactionDto } from '@balance/modules/account/dto/account-apply-transaction.dto';
import { AccountCreateIfNotExistsDto } from '@balance/modules/account/dto/account-create-if-not-exists.dto';
import { Transaction, TransactionSubType, TransactionType } from '@balance/modules/transaction/transaction.entity';

import { randomStrNum } from '@supertest/common/test-helpers';
import { config } from '@supertest/config';

describe('Accounting', () => {
  let balanceRpcClient: ClientProxy;

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
          ],
        }),
      ],
    }).compile();

    balanceRpcClient = moduleRef.get<ClientProxy>(RpcClient.BALANCE);
  });

  afterAll(async () => {
    await balanceRpcClient.close();
  });

  describe('Deposit', () => {
    const playerId = randomStrNum();

    it.each([
      { currency: CurrencyCode.USDT, amount: '100' },
      { currency: CurrencyCode.USDT, amount: '1' },
      { currency: CurrencyCode.USDT, amount: '500' },
      { currency: CurrencyCode.USDT, amount: '0.5' },
      {
        currency: CurrencyCode.USDT,
        amount: '0.000000000000001',
      },
      {
        currency: CurrencyCode.USDT,
        amount: '1234.0000000000000001',
      },
      {
        currency: CurrencyCode.USDT,
        amount: '0.0000000000000001',
      },
      {
        currency: CurrencyCode.USDT,
        amount: '999999999.999999999999999999',
      },
    ])('should handle deposit transaction correctly with %s', async ({ currency: currencyCode, amount: amountStr }) => {
      const amount = Big(amountStr).shiftedBy(AmountDecimals.NATIVE).toFixed().toString();

      const account = await firstValueFrom(
        balanceRpcClient.send<Account, AccountCreateIfNotExistsDto>(
          getMessagePatternFromDto(AccountCreateIfNotExistsDto),
          { currencyCode, playerId },
        ),
      );

      const depositTransaction = await firstValueFrom(
        balanceRpcClient.send<Transaction, AccountApplyTransactionDto>(
          getMessagePatternFromDto(AccountApplyTransactionDto),
          {
            amount,
            currencyCode,
            playerId: account.playerId,
            accountId: account.id,
            subtype: TransactionSubType.DEPOSIT,
            type: TransactionType.IN,
          },
        ),
      );

      expect(depositTransaction.playerId).toBe(account.playerId);
      expect(depositTransaction.currencyCode).toBe(currencyCode);
      expect(depositTransaction.type).toBe(TransactionType.IN);
      expect(depositTransaction.subtype).toBe(TransactionSubType.DEPOSIT);

      const accountAfterDeposit = await firstValueFrom(
        balanceRpcClient.send<Account, AccountCreateIfNotExistsDto>(
          getMessagePatternFromDto(AccountCreateIfNotExistsDto),
          { playerId: account.playerId, currencyCode },
        ),
      );

      expect(new Big(account.balance).plus(amount).toFixed().toString()).toBe(accountAfterDeposit.balance);
    });
  });
});
