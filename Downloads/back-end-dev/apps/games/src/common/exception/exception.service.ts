import { TypeORMError } from 'typeorm';

import { HttpException, Injectable } from '@nestjs/common';

import { TtLogger } from '@app/logger';

export const GAMES_ERRORS = {
  // System errors
  SERVER_ERROR: {
    message: 'Internal server error',
    httpCode: 500,
  },

  // Session errors
  SESSION_NOT_FOUND: {
    message: 'Session not found',
    httpCode: 404,
  },
  SESSION_CLOSED: {
    message: 'Session is closed',
    httpCode: 400,
  },

  // Game errors
  GAME_NOT_FOUND: {
    message: 'Game not found',
    httpCode: 404,
  },
  GAME_DISABLED: {
    message: 'Game not available',
    httpCode: 403,
  },
  GAME_RESTRICTED_FOR_REGION: {
    message: 'Game not available for your region',
    httpCode: 403,
  },
  MAX_BET_EXCEED: {
    message: 'Max bet exceed',
    httpCode: 403,
  },
  PLAYER_BLOCKED: {
    message: 'Player is blocked',
    httpCode: 403,
  },
} as const;

type ErrorDetails = Record<string, unknown> & {
  timestamp?: Date;
};

export type GameErrorCode = keyof typeof GAMES_ERRORS;

export class GameHttpException extends HttpException {
  constructor(
    readonly errorCode: GameErrorCode,
    readonly details?: ErrorDetails,
  ) {
    const errorConfig = GAMES_ERRORS[errorCode];

    super(
      {
        errorCode,
        message: errorConfig.message,
        details: {
          ...details,
          timestamp: new Date(),
        },
      },
      errorConfig.httpCode,
    );
  }
}

@Injectable()
export class GameExceptionService {
  constructor(private readonly logger: TtLogger) {}

  static isDuplicateKeyError(err: unknown): err is TypeORMError & {
    detail: string;
  } {
    return err instanceof TypeORMError && err.message.includes('duplicate key');
  }

  throw(code: GameErrorCode, details?: ErrorDetails): never {
    const errorConfig = GAMES_ERRORS[code];

    if (code === 'SERVER_ERROR') {
      this.logger.error({
        msg: `Error "${code}" occurred.`,
        data: details,
        err: new Error(errorConfig.message),
      });
    } else {
      this.logger.debug({
        msg: `Error "${code}" occurred.`,
        data: details,
      });
    }

    throw new GameHttpException(code, details);
  }

  handleDatabaseError(error: TypeORMError): never {
    if (GameExceptionService.isDuplicateKeyError(error)) {
      this.throw('SERVER_ERROR', {
        constraint: 'unique',
        detail: error.message,
      });
    }

    this.throw('SERVER_ERROR', {
      detail: error.message,
    });
  }
}
