import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateIdentitySubscription1741171656769 implements MigrationInterface {
  transaction = false;

  public async up(queryRunner: QueryRunner): Promise<void> {
    const { pgIdentityHost, replicatorUsername, replicatorPassword } = this.validateEnvironment();

    await queryRunner.query(/*sql*/ `
      CREATE SUBSCRIPTION identity_rbac_subscription
      CONNECTION 'dbname=identity host=${pgIdentityHost} user=${replicatorUsername} password=${replicatorPassword}'
      PUBLICATION "identity_rbac_publication";
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const { replicatorUsername } = this.validateEnvironment();

    queryRunner.query(/*sql*/ `DROP SUBSCRIPTION IF EXISTS identity_rbac_subscription;`);

    await queryRunner.query(/*sql*/ `DROP ROLE IF EXISTS ${replicatorUsername};`);
  }

  private validateEnvironment() {
    const data = {
      pgIdentityHost: process.env.PG_IDENTITY_HOST,
      replicatorUsername: process.env.PG_REPLICATOR_USERNAME,
      replicatorPassword: process.env.PG_REPLICATOR_PASSWORD,
    };

    const errors = Object.entries(data)
      .map(([key, value]) => (value ? null : `Environment variable required: ${key}`))
      .filter(Boolean);

    if (errors.length) {
      throw new Error(errors.join('\n'));
    }

    return data;
  }
}
