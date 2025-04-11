import { createHmac, timingSafeEqual } from 'crypto';

import { Injectable } from '@nestjs/common';

import { PasswordConfig } from '@common/modules/config/configs';

@Injectable()
export class PasswordService {
  constructor(private readonly passwordConfig: PasswordConfig) {}

  hashPassword(password: string) {
    return createHmac(this.passwordConfig.algorithm, password + this.passwordConfig.salt).digest('hex');
  }

  comparePassword(password: string, passwordHash: string): boolean {
    const storedHash = Buffer.from(passwordHash);
    const providedHash = Buffer.from(this.hashPassword(password));
    return timingSafeEqual(storedHash, providedHash);
  }
}
