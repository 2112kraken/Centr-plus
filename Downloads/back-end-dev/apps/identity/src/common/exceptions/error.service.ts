import { I18nService } from 'nestjs-i18n';
import { TypeORMError } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { TtLogger } from '@app/logger';

import { UserException } from '@common/exception/user.exception';

export enum ErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  REFRESH_ACCESS_TOKEN_REQUIRED = 'REFRESH_ACCESS_TOKEN_REQUIRED',
  DUPLICATE_CONTACT = 'DUPLICATE_CONTACT',
  WRONG_CREDENTIALS = 'WRONG_CREDENTIALS',
  WRONG_CONFIRMATION_TOKEN = 'WRONG_CONFIRMATION_TOKEN',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  INVALID_TOKEN = 'INVALID_TOKEN',
  USER_BLOCKED = 'USER_BLOCKED',
  SERVER_ERROR = 'SERVER_ERROR',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  CONTACT_NOT_FOUND = 'CONTACT_NOT_FOUND',
  CONTACT_ALREADY_VERIFIED = 'CONTACT_ALREADY_VERIFIED',
}

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.SERVER_ERROR]: 'errors.general.server_error',

  [ErrorCode.DUPLICATE_CONTACT]: 'errors.user.contacts_exist',
  [ErrorCode.CONTACT_NOT_FOUND]: 'errors.user.contact_not_found',
  [ErrorCode.USER_NOT_FOUND]: 'errors.user.not_found',
  [ErrorCode.USER_BLOCKED]: 'errors.user.account_suspended',
  [ErrorCode.CONTACT_ALREADY_VERIFIED]: 'errors.user.contact_already_verified',

  [ErrorCode.UNAUTHORIZED]: 'errors.identity.login_required',
  [ErrorCode.WRONG_CREDENTIALS]: 'errors.identity.invalid_credentials',
  [ErrorCode.WRONG_CONFIRMATION_TOKEN]: 'errors.identity.invalid_confirmation',
  [ErrorCode.INVALID_TOKEN]: 'errors.identity.session_expired',
  [ErrorCode.INVALID_CREDENTIALS]: 'errors.identity.check_credentials',
  [ErrorCode.REFRESH_ACCESS_TOKEN_REQUIRED]: 'error.identity.refresh_token_required',
};

@Injectable()
export class ErrorService {
  constructor(
    private readonly logger: TtLogger,
    private readonly i18n: I18nService,
  ) {}

  static isDuplicateKeyError(err: unknown): err is TypeORMError & {
    detail: string;
  } {
    return err instanceof TypeORMError && err.message.includes('duplicate key');
  }

  throw(code: ErrorCode, details?: Record<string, unknown>): never {
    if (code === ErrorCode.SERVER_ERROR) {
      this.logger.error({
        msg: 'Server error "${code}" occurred.',
        data: details,
        err: new Error(code),
      });
    }

    throw new UserException({
      code,
      message: this.i18n.t(ERROR_MESSAGES[code]),
      details: details ? JSON.stringify(details) : undefined,
    });
  }
}
