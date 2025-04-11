import { AsyncLocalStorage } from 'node:async_hooks';

export interface StorageData {
  userId: string;
}

export const asyncLocalStorage = new AsyncLocalStorage<StorageData>();
