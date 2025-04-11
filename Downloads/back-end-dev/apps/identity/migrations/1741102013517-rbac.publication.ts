import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePublication1741102013517 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const { replicatorUsername, appName } = this.validateEnvironment();

    await queryRunner.query(/* sql */ `
      GRANT SELECT ON ALL TABLES IN SCHEMA public TO ${replicatorUsername};
    `);

    await queryRunner.query(/* sql */ `
      CREATE PUBLICATION ${appName}_rbac_publication
      FOR TABLE roles_to_admins, roles_to_roles, roles_to_permissions, role, permission;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const { appName } = this.validateEnvironment();

    await queryRunner.query(/* sql */ `
      DROP PUBLICATION IF EXISTS ${appName}_rbac_publication;
    `);
  }

  private validateEnvironment() {
    const { PG_REPLICATOR_USERNAME, PG_REPLICATOR_PASSWORD, APP_NAME } = process.env;

    if (!PG_REPLICATOR_USERNAME || !PG_REPLICATOR_PASSWORD || !APP_NAME) {
      throw new Error('Environment variables required: PG_REPLICATOR_USERNAME, PG_REPLICATOR_PASSWORD, APP_NAME');
    }

    return {
      replicatorUsername: PG_REPLICATOR_USERNAME,
      replicatorPassword: PG_REPLICATOR_PASSWORD,
      appName: APP_NAME,
    };
  }
}
