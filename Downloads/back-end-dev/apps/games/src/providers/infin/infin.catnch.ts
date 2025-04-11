import { FastifyReply } from 'fastify';

import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';

import { TtLogger } from '@app/logger';

import { XML } from '@common/libs/xml-parser.lib';

import { GameErrorCode, GameHttpException } from '@games/common/exception/exception.service';

/*
  common errors:
    WL_ERROR: Internal server error.

  enter errors:
    INVALID_KEY: Indicates that the provided key is invalid.
    EXPIRED_KEY: Denotes that the provided key has expired.
    GAME_NOT_ALLOWED: Specifies that the game is not permitted to access the wallet.
    USER_BLOCKED: Indicates that the user is restricted from accessing the wallet.
    MAX_LOGIN_EXCEEDED: Signifies that the maximum number of login attempts has been exceeded.

  re-enter errors:
    GAME_NOT_ALLOWED: Specifies that the game is not permitted to access the wallet.
    USER_BLOCKED: Indicates that the user is restricted from accessing the wallet.
    SESSION_CLOSED: Denotes that the session has been closed.

  roundbet errors:
    GAME_NOT_ALLOWED: Specifies that the game is not permitted to access the wallet.
    USER_BLOCKED: Indicates that the user is restricted from accessing the wallet.
    SESSION_CLOSED: Denotes that the session has been closed.
    MAX_BET_EXCEED: Signifies that the maximum bet amount has been exceeded.
    MAX_TIME_EXCEED: Indicates that the maximum time spent in the game has been exceeded.
    NOT_ENOUGH_MONEY: Denotes that the player's wallet balance is insufficient for the bet.

  roundwin errors:
    BALANCE_OVERFLOW: Denotes that the player's wallet balance has exceeded the maximum allowed value.

  refund errors:
    BALANCE_OVERFLOW: Denotes that the player's wallet balance has exceeded the maximum allowed value.
*/

@Catch()
export class InfinCatch implements ExceptionFilter {
  constructor(private readonly logger: TtLogger) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest();
    const status = exception instanceof GameHttpException ? exception.getStatus() : 500;
    const timestamp = new Date().toISOString();

    let errorCode = 'WL_ERROR';
    let errorMessage = 'Internal server error';
    const params = request.body?.server || {};
    const [commandName] = Object.keys(params);

    const errorCodeMap: Record<GameErrorCode, string> = {
      SERVER_ERROR: 'WL_ERROR',
      GAME_DISABLED: 'GAME_NOT_ALLOWED',
      GAME_NOT_FOUND: 'GAME_NOT_ALLOWED',
      GAME_RESTRICTED_FOR_REGION: 'GAME_NOT_ALLOWED',
      MAX_BET_EXCEED: 'MAX_BET_EXCEED',
      PLAYER_BLOCKED: 'USER_BLOCKED',
      SESSION_CLOSED: 'SESSION_CLOSED',
      SESSION_NOT_FOUND: 'SESSION_CLOSED',
    };

    if (exception instanceof GameHttpException) {
      errorCode = errorCodeMap[exception.errorCode] || 'WL_ERROR';
      errorMessage = exception.message;
    }

    if (exception.message === 'INSUFFICIENT_FUNDS') {
      errorCode = 'NOT_ENOUGH_MONEY';
      errorMessage = `Player has not enough money to ${commandName}.`;
    }

    if (errorCode === 'WL_ERROR') {
      this.logger.error({
        err: exception,
        data: { requestBody: request.body },
      });
    }

    return response
      .status(status)
      .header('Content-Type', 'application/xml')
      .send(
        XML.stringify({
          service: {
            '@session': params.session,
            '@time': timestamp,
            [commandName]: {
              '@id': params[commandName]['@id'],
              '@result': 'error',
              error: {
                '@code': errorCode,
                msg: errorMessage,
              },
            },
          },
        }),
      );
  }
}
