import { randomInt } from 'crypto';

import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

export enum TempTokenType {
  RESET_PASSWORD = 'RESET_PASSWORD',
  CONFIRM_CONTACT = 'CONFIRM_CONTACT',
}

export interface TempToken {
  type: TempTokenType;
  value: string;
  expireAt: number;
}

export interface TokenPayload {
  type: TempTokenType.RESET_PASSWORD;
  contact: string;
}

export interface IdentifiedTokenPayload extends Omit<TokenPayload, 'type'> {
  type: Exclude<TempTokenType, 'RESET_PASSWORD'>;
  identifier: string;
}

@Injectable()
export class TempTokenService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async createTempToken(params: (TokenPayload | IdentifiedTokenPayload) & { ttlMs: number }): Promise<TempToken> {
    const value = randomInt(10000000, 99999999).toString();
    const key = this.createTokenKey(params);

    await this.cacheManager.set(key, value, params.ttlMs);

    return {
      value,
      type: params.type,
      expireAt: Date.now() + params.ttlMs,
    };
  }

  async verifyTempToken(token: string, params: TokenPayload | IdentifiedTokenPayload): Promise<boolean> {
    const key = this.createTokenKey(params);
    const storedToken = await this.cacheManager.get<string>(key);

    if (storedToken) {
      await this.cacheManager.del(key);
    }

    return storedToken === token;
  }

  private createTokenKey(params: TokenPayload | IdentifiedTokenPayload): string {
    if (params.type === TempTokenType.RESET_PASSWORD) {
      return `token:${params.type}:${params.contact}`;
    }

    return `token:${params.type}:${params.identifier}:${params.contact}`;
  }
}
