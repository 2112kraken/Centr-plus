import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGamesSubscription1743501007760 implements MigrationInterface {
  transaction = false;

  public async up(queryRunner: QueryRunner): Promise<void> {
    const { pgGamesHost, replicatorUsername, replicatorPassword } = this.validateEnvironment();

    await queryRunner.query(/*sql*/ `
      CREATE SUBSCRIPTION games_subscription
      CONNECTION 'dbname=games host=${pgGamesHost} user=${replicatorUsername} password=${replicatorPassword}'
      PUBLICATION "games_publication";
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const { replicatorUsername } = this.validateEnvironment();

    await queryRunner.query(/*sql*/ `DROP SUBSCRIPTION IF EXISTS games_subscription;`);

    await queryRunner.query(/*sql*/ `DROP ROLE IF EXISTS ${replicatorUsername};`);
  }

  private validateEnvironment() {
    const data = {
      pgGamesHost: process.env.PG_GAMES_HOST,
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
