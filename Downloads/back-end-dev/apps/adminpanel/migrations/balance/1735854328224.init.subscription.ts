import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBalanceSubscription1735854328224 implements MigrationInterface {
  transaction = false;

  public async up(queryRunner: QueryRunner): Promise<void> {
    const { pgBalanceHost, replicatorUsername, replicatorPassword } = this.validateEnvironment();

    await queryRunner.query(/*sql*/ `
      GRANT SELECT ON ALL TABLES IN SCHEMA public TO ${replicatorUsername};
    `);

    await queryRunner.query(/*sql*/ `
      CREATE SUBSCRIPTION balance_subscription
      CONNECTION 'dbname=balance host=${pgBalanceHost} user=${replicatorUsername} password=${replicatorPassword}'
      PUBLICATION balance_publication;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `DROP SUBSCRIPTION IF EXISTS balance_subscription;`);
  }

  private validateEnvironment() {
    const data = {
      pgBalanceHost: process.env.PG_BALANCE_HOST,
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
