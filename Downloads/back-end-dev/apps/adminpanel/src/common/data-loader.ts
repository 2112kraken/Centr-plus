import * as DataLoader from 'dataloader';
import { FindOptionsWhere, In, Repository } from 'typeorm';

import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class DataLoaderFactory {
  createLoader<T extends { id: number | string }>(repository: Repository<T>, key: keyof T = 'id') {
    return new DataLoader<T['id'], T | null>(async (ids) => {
      const entities = await repository.findBy({
        [key]: In(ids),
      } as FindOptionsWhere<T>);

      const entityMap = new Map(entities.map((e) => [e[key] as T['id'], e]));

      return ids.map((id) => entityMap.get(id) ?? null);
    });
  }

  createLoaderMany<T extends { id: number | string }>(
    repository: Repository<T>,
    key: keyof T = 'id',
  ): DataLoader<T['id'], T[]> {
    return new DataLoader<T['id'], T[]>(async (ids) => {
      const entities = await repository.find({
        where: {
          [key]: In(ids),
        } as FindOptionsWhere<T>,
      });

      // Pre-initialize the map with empty arrays
      const entityMap: Map<T['id'], T[]> = new Map(ids.map((id) => [id, []]));

      // Single pass through entities to group them
      entities.forEach((entity) => {
        const keyValue = entity[key] as T['id'];
        const group = entityMap.get(keyValue);
        if (group) group.push(entity);
      });

      return ids.map((id) => entityMap.get(id) ?? []);
    });
  }
}
