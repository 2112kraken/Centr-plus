import { MigrationInterface, QueryRunner } from 'typeorm';

export class GameLocal1741964199331 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const env = process.env.NODE_ENV || '';

    if (!['local', 'docker', 'dev'].includes(env)) {
      return;
    }

    // Create test provider
    await queryRunner.query(/*sql*/ `
      INSERT INTO "game_provider" ("id", "name", "code")
      VALUES (1, 'Local Test Provider', 'INFIN')
      ON CONFLICT DO NOTHING;
    `);

    // Create test vendor
    await queryRunner.query(/*sql*/ `
      INSERT INTO "game_vendor" ("id", "name", "slug", "languages", "regions")
      VALUES (1, 'Test Vendor', 'test-vendor', ARRAY['EN','UA']::varchar(2)[], ARRAY['US','UA']::varchar(2)[])
      ON CONFLICT DO NOTHING;
    `);

    // Create test game
    await queryRunner.query(/*sql*/ `
      INSERT INTO "game" (
        "id", "vendorId", "providerId", "name", "slug", "code",
        "types", "subType", "currencies", "regions", "languages"
      )
      VALUES (
        1, 1, 1, 'Test Slot Game', 'test-slot-game', 'test-slot-game',
        ARRAY['SLOT']::game_type[], 'CLASSIC'::game_sub_type,
        ARRAY['USD','EUR']::varchar(32)[], ARRAY['US','UA']::varchar(2)[], ARRAY['EN','UA']::varchar(2)[]
      )
      ON CONFLICT DO NOTHING;
    `);

    // Create test slot game details
    await queryRunner.query(/*sql*/ `
      INSERT INTO "slot_game" (
        "gameId", "rpt", "minBetUsd", "maxBetUsd",
        "volatility", "reels", "rows", "payLines",
        "features"
      )
      VALUES (
        1, 96.5, 0.10, 100.00,
        'MEDIUM'::game_volatility, 5, 3, 20,
        ARRAY['FREE_SPINS', 'BONUS_ROUND']::slot_game_feature[]
      )
      ON CONFLICT DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const env = process.env.NODE_ENV;
    if (env === 'local' || env === 'docker' || env === 'dev') {
      return;
    }

    await queryRunner.query(/*sql*/ `DELETE FROM "slot_game" WHERE "gameId" = 1;`);
    await queryRunner.query(/*sql*/ `DELETE FROM "game" WHERE "id" = 1;`);
    await queryRunner.query(/*sql*/ `DELETE FROM "game_vendor" WHERE "id" = 1;`);
    await queryRunner.query(/*sql*/ `DELETE FROM "game_provider" WHERE "id" = 1;`);
  }
}
