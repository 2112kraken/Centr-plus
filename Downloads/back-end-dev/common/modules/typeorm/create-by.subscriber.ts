import { EventSubscriber, EntitySubscriberInterface, InsertEvent } from 'typeorm';

import { asyncLocalStorage } from '@common/async-local-storage';

export const CREATED_BY_METADATA_KEY = Symbol('CREATED_BY_METADATA_KEY');

@EventSubscriber()
export class CreatedByUserIdSubscriber implements EntitySubscriberInterface {
  beforeInsert(event: InsertEvent<Record<string, unknown>>): void {
    const store = asyncLocalStorage.getStore();
    if (!store?.userId) return;

    const entity = event.entity;
    for (const propertyKey of Object.keys(entity)) {
      if (Reflect.getMetadata(CREATED_BY_METADATA_KEY, entity, propertyKey)) {
        entity[propertyKey] = entity[propertyKey] ?? store.userId;
      }
    }
  }
}

export function CreatedByUserId(): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    Reflect.defineMetadata(CREATED_BY_METADATA_KEY, true, target, propertyKey);
  };
}
