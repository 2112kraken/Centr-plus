import { MigrationInterface, QueryRunner } from 'typeorm';

import { apply, rollback } from '@common/modules/migrations/rbac-helpers';

export class AdminRole1739888443116 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const scope = 'ADMIN';
    const roles = [
      {
        name: 'PLAYER_RW',
        permissions: ['PLAYER_WRITE'],
        extends: [{ name: 'PLAYER_RO', permissions: ['PLAYER_READ'] }],
      },
      {
        name: 'SUPER_ADMIN',
        extends: ['PLAYER_RW'],
      },
    ];

    await apply(scope, roles, queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const scope = 'ADMIN';
    const roles = [
      {
        name: 'PLAYER_RW',
        permissions: ['PLAYER_WRITE'],
        extends: [{ name: 'PLAYER_RO', permissions: ['PLAYER_READ'] }],
      },
      {
        name: 'SUPER_ADMIN',
        extends: ['PLAYER_RW'],
      },
    ];

    await rollback(scope, roles, queryRunner);
  }
}
