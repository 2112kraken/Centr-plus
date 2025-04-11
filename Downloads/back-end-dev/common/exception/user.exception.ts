import { plainToInstance } from 'class-transformer';

export class UserException extends Error {
  readonly code: string;
  readonly details?: string;

  constructor(params: Omit<UserException, 'name'>) {
    super(params?.message);
    Object.assign(this, plainToInstance(UserException, params));
  }
}
