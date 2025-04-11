import { firstValueFrom } from 'rxjs';

import { Inject, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';

import { getMessagePatternFromDto } from '@app/nest-dto-rpc';

import { XML } from '@common/libs/xml-parser.lib';
import { CurrencyExchangeConvertResponse } from '@common/modules/currency-exchange/currency-exchange';
import { CurrencyExchangeService } from '@common/modules/currency-exchange/currency-exchange.service';
import { RpcClient } from '@common/modules/rpc/service-name.enum';

import type { Account } from '@balance/modules/account/account.entity';
import { AccountCreateIfNotExistsDto } from '@balance/modules/account/dto/account-create-if-not-exists.dto';
import { AccountGetDto } from '@balance/modules/account/dto/account-get.dto';
import { TransactionSubType } from '@balance/modules/transaction/transaction.entity';

import { GameSessionActivateCommand } from '@games/actions/game-session-activate.command';
import { GameSessionCreateCommand } from '@games/actions/game-session-create.command';
import { SessionGetActiveQuery } from '@games/actions/game-session-get.query';
import { SpinRollbackCommand } from '@games/actions/spin-rollback.command';
import { SpinCommand } from '@games/actions/spin.command';
import { GameSession } from '@games/modules/game/entity/game-session.entity';

@Injectable()
export class InfinService {
  constructor(
    @Inject(RpcClient.BALANCE)
    private readonly balanceRpcClient: ClientProxy,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly currencyExchangeService: CurrencyExchangeService,
  ) {}

  /**
   *
   * @example
   * Request:
   * ```xml
   * <server session="DEADBEEF" time="2021-01-01T00:00:00.000Z">
   *   <enter id="..." guid="..." key="...">
   *     <game name="..."></game>
   *   </enter>
   * </server>
   * ```
   * Response:
   * ```xml
   * <service session="DEADBEEF" time="2021-01-01T00:00:00.000Z">
   *   <enter id="..." result="ok">
   *     <balance currency="..." value="..."></balance>
   *     <user wlid="..."></user>
   *   </enter>
   * </service>
   * ```
   */
  async enter(body: Record<string, any>) {
    const newExternalId = body.server.enter['@guid'];
    const externalId = body.server.enter['@key'];
    const gameCode = body.server.enter.game['@name'];

    const session: GameSession = await this.commandBus.execute(
      new GameSessionActivateCommand({
        gameCode,
        externalId,
        newExternalId,
      }),
    );

    const account: Account = await firstValueFrom(
      this.balanceRpcClient.send<Account, AccountCreateIfNotExistsDto>(
        getMessagePatternFromDto(AccountCreateIfNotExistsDto),
        {
          currencyCode: session.accountCurrencyCode,
          playerId: session.playerId,
        },
      ),
    );

    const balance = this.currencyExchangeService.convertForProvider({
      amount: account.balance,
      amountCurrencyCode: session.accountCurrencyCode,
      convertedCurrencyCode: session.gameCurrencyCode,
      convertedAmountDecimals: 2,
    });

    return XML.stringify({
      service: {
        '@session': body.server['@session'],
        '@time': new Date().toISOString(),
        enter: {
          '@id': body.server.enter['@id'],
          '@result': 'ok',
          balance: {
            '@currency': balance.convertedCurrencyCode,
            '@value': balance.convertedAmount,
          },
          user: {
            '@wlid': `${account.id}-${session.gameCurrencyCode}`,
          },
        },
      },
    });
  }

  /**
   *
   * @example
   * Request:
   * ```xml
    <server session="DEADBEEF" time="2021-01-01T00:00:00.000Z">
        <re-enter id="..." guid="..." new-guid="..." wlid="...">
            <game name="..."></game>
        </re-enter>
    </server>
   * ```
   * Response:
   * ```xml
   * <service session="DEADBEEF" time="2021-01-01T00:00:00.000Z">
   *   <enter id="..." result="ok">
   *     <balance currency="..." value="..."></balance>
   *     <user wlid="..."></user>
   *   </enter>
   * </service>
   * ```
   */
  async reEnter(body: Record<string, any>) {
    const {
      '@guid': externalId,
      '@new-guid': newExternalId,
      game: { '@name': gameCode },
    } = body.server['re-enter'];

    const parentSession = await this.queryBus.execute<SessionGetActiveQuery, GameSession>(
      new SessionGetActiveQuery({ externalId }),
    );

    const session = await this.commandBus.execute<GameSessionCreateCommand, GameSession>(
      new GameSessionCreateCommand({
        gameCode,
        externalId: newExternalId,
        accountCurrencyCode: parentSession.accountCurrencyCode,
        gameCurrencyCode: parentSession.gameCurrencyCode,
        playerId: parentSession.playerId,
        activatedAt: new Date(),
      }),
    );

    const account = await firstValueFrom(
      this.balanceRpcClient.send<Account, AccountCreateIfNotExistsDto>(
        getMessagePatternFromDto(AccountCreateIfNotExistsDto),
        {
          currencyCode: session.accountCurrencyCode,
          playerId: session.playerId,
        },
      ),
    );

    const balance = this.currencyExchangeService.convertForProvider({
      amount: account.balance,
      amountCurrencyCode: session.accountCurrencyCode,
      convertedCurrencyCode: session.gameCurrencyCode,
      convertedAmountDecimals: 2,
    });

    return XML.stringify({
      service: {
        '@session': body.server['@session'],
        '@time': new Date().toISOString(),
        ['re-enter']: {
          '@id': body.server['re-enter']['@id'],
          '@result': 'ok',
          balance: {
            '@currency': balance.convertedCurrencyCode,
            '@value': balance.convertedAmount,
          },
          user: {
            '@wlid': `${account.id}-${session.gameCurrencyCode}`,
          },
        },
      },
    });
  }

  /**
   *
   * @example
   * Request:
   * ```xml
    <server session="DEADBEEF" time="2021-01-01T00:00:00.000Z">
        <re-enter id="..." guid="..." new-guid="..." wlid="...">
            <game name="..."></game>
        </re-enter>
    </server>
   * ```
   * Response:
   * ```xml
   * <service session="DEADBEEF" time="2021-01-01T00:00:00.000Z">
   *   <enter id="..." result="ok">
   *     <balance currency="..." value="..."></balance>
   *     <user wlid="..."></user>
   *   </enter>
   * </service>
   * ```
   */
  async getbalance(body: Record<string, any>) {
    const [accountId, gameCurrencyCode] = body.server.getbalance['@wlid'].split('-');

    const account: Account = await firstValueFrom(
      this.balanceRpcClient.send<Account, AccountGetDto>(getMessagePatternFromDto(AccountGetDto), { accountId }),
    );

    const balance = this.currencyExchangeService.convertForProvider({
      amount: account.balance,
      amountCurrencyCode: account.currencyCode,
      convertedCurrencyCode: gameCurrencyCode,
      convertedAmountDecimals: 2,
    });

    return XML.stringify({
      service: {
        '@session': body.server['@session'],
        '@time': new Date().toISOString(),
        getbalance: {
          '@id': body.server.getbalance['@id'],
          '@result': 'ok',
          balance: {
            '@currency': balance.convertedCurrencyCode,
            '@value': balance.convertedAmount,
          },
        },
      },
    });
  }

  /**
   * Process bet for a game round
   * @example
   * Request:
   * ```xml
   * <server session="DEADBEEF" time="2021-01-01T00:00:00.000Z">
   *   <roundbet id="..." guid="..." wlid="..." bet="..." type="..." finished="...">
   *     <game name="..."></game>
   *     <roundnum id="..."></roundnum>
   *   </roundbet>
   * </server>
   * ```
   * Response:
   * ```xml
   * <service session="DEADBEEF" time="2021-01-01T00:00:00.000Z">
   *   <roundbet id="..." result="ok">
   *     <balance currency="..." value="..."></balance>
   *     <user wlid="..."></user>
   *   </roundbet>
   * </service>
   * ```
   */
  async roundbet(body: Record<string, any>) {
    const { '@guid': externalId, '@bet': amount, '@id': id } = body.server.roundbet;

    const balanceAfterBet = await this.commandBus.execute<SpinCommand, CurrencyExchangeConvertResponse>(
      new SpinCommand({
        externalTransactionId: id,
        type: TransactionSubType.BET,
        externalId: externalId,
        spinAmount: { amount, decimals: 2 },
      }),
    );

    return XML.stringify({
      service: {
        '@session': body.server['@session'],
        '@time': new Date().toISOString(),
        roundbet: {
          '@id': id,
          '@result': 'ok',
          balance: {
            '@currency': balanceAfterBet.convertedCurrencyCode,
            '@value': balanceAfterBet.convertedAmount,
          },
        },
      },
    });
  }

  /**
   * Process win for a game round
   * @example
   * Request:
   * ```xml
   * <server session="DEADBEEF" time="2021-01-01T00:00:00.000Z">
   *   <roundwin id="..." guid="..." wlid="..." win="..." type="..." finished="...">
   *     <game name="..."></game>
   *     <roundnum id="..."></roundnum>
   *   </roundwin>
   * </server>
   * ```
   * Response:
   * ```xml
   * <service session="DEADBEEF" time="2021-01-01T00:00:00.000Z">
   *   <roundwin id="..." result="ok">
   *     <balance currency="..." value="..."></balance>
   *     <user wlid="..."></user>
   *   </roundwin>
   * </service>
   * ```
   */
  async roundwin(body: Record<string, any>) {
    const { '@guid': externalId, '@win': amount, '@id': id } = body.server.roundwin;

    const balanceAfterWin = await this.commandBus.execute<SpinCommand, CurrencyExchangeConvertResponse>(
      new SpinCommand({
        externalTransactionId: id,
        type: TransactionSubType.WIN,
        externalId: externalId,
        spinAmount: { amount, decimals: 2 },
      }),
    );

    return XML.stringify({
      service: {
        '@session': body.server['@session'],
        '@time': new Date().toISOString(),
        roundwin: {
          '@id': id,
          '@result': 'ok',
          balance: {
            '@currency': balanceAfterWin.convertedCurrencyCode,
            '@value': balanceAfterWin.convertedAmount,
          },
        },
      },
    });
  }

  /**
   * Process win for a game round
   * @example
   * Request:
   * ```xml
      <server session="DEADBEEF" time="2021-01-01T00:00:00.000Z">
          <refund id="..." guid="..." wlid="..." cash="...">
              <storno cmd="roundbet" id="..." wlid="..." guid="..." gameid="..." cash="...">
                  <roundnum id="..."></roundnum>
              </storno>
          </refund>
      </server>
   * ```
   * Response:
   * ```xml
   * <service session="DEADBEEF" time="2021-01-01T00:00:00.000Z">
   *   <refund id="..." result="ok">
   *     <balance currency="..." value="..."></balance>
   *   </refund>
   * </service>
   * ```
   */
  async refund(body: Record<string, any>) {
    const { '@guid': externalSessionId, '@id': id, storno } = body.server.refund;
    const { '@id': externalTransactionId } = storno;

    const balanceAfterWin = await this.commandBus.execute<SpinRollbackCommand, CurrencyExchangeConvertResponse>(
      new SpinRollbackCommand({ externalSessionId, externalTransactionId, responseBalanceDecimals: 2 }),
    );

    return XML.stringify({
      service: {
        '@session': body.server['@session'],
        '@time': new Date().toISOString(),
        refund: {
          '@id': id,
          '@result': 'ok',
          balance: {
            '@currency': balanceAfterWin.convertedCurrencyCode,
            '@value': balanceAfterWin.convertedAmount,
          },
        },
      },
    });
  }
}
