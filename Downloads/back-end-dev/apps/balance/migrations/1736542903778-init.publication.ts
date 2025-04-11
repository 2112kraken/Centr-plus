import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitPublication1736542903778 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const { appName, replicatorUsername } = this.validateEnvironment();

    await queryRunner.query(/* sql */ `
      GRANT SELECT ON ALL TABLES IN SCHEMA public TO ${replicatorUsername};
    `);

    await queryRunner.query(/* sql */ `
      CREATE PUBLICATION ${appName}_publication
      FOR TABLE account, transaction;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const { appName, replicatorUsername } = this.validateEnvironment();

    await queryRunner.query(/* sql */ `
      DROP PUBLICATION IF EXISTS ${appName}_publication;
    `);

    await queryRunner.query(/* sql */ `
      REVOKE SELECT ON ALL TABLES IN SCHEMA public FROM ${replicatorUsername};
    `);
  }

  private validateEnvironment() {
    const { PG_REPLICATOR_USERNAME, APP_NAME } = process.env;

    if (!PG_REPLICATOR_USERNAME || !APP_NAME) {
      throw new Error('Environment variables required: APP_NAME, PG_REPLICATOR_USERNAME');
    }

    return {
      appName: APP_NAME,
      replicatorUsername: PG_REPLICATOR_USERNAME,
    };
  }
}
