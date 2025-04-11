import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePublication1736542903778 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const { replicatorUsername, appName } = this.validateEnvironment();

    await queryRunner.query(/* sql */ `
      GRANT SELECT ON ALL TABLES IN SCHEMA public TO ${replicatorUsername};
    `);

    await queryRunner.query(/* sql */ `
      CREATE PUBLICATION ${appName}_publication
      FOR TABLE admin, admin_contact, session, player, player_contact, player_info, player_block_info;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const { replicatorUsername, appName } = this.validateEnvironment();

    await queryRunner.query(/* sql */ `
      DROP PUBLICATION IF EXISTS ${appName}_publication;
    `);

    await queryRunner.query(/* sql */ `
      REVOKE SELECT ON ALL TABLES IN SCHEMA public FROM ${replicatorUsername};
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
