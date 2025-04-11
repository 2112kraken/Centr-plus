import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitMigration1741964199330 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create ENUM types
    await queryRunner.query(/*sql*/ `
      CREATE TYPE "game_type" AS ENUM ('SLOT', 'TABLE', 'LIVE', 'LOTTERY', 'VIRTUAL', 'SPORTS');
      CREATE TYPE "game_sub_type" AS ENUM ('CLASSIC', 'VIDEO', 'PROGRESSIVE', 'BLACKJACK', 'ROULETTE', 'BACCARAT', 'POKER', 'KENO', 'BINGO', 'FOOTBALL', 'TENNIS', 'HORSE_RACING', 'BASKETBALL');
      CREATE TYPE "game_status" AS ENUM ('ENABLED', 'DISABLED');
      CREATE TYPE "game_volatility" AS ENUM ('LOW', 'MEDIUM', 'HIGH');
      CREATE TYPE "slot_game_feature" AS ENUM ('BONUS_ROUND', 'FREE_SPINS', 'PROGRESSIVE_JACKPOT', 'FIXED_JACKPOT', 'MULTIPLIER', 'AUTOPLAY');
      CREATE TYPE "live_game_feature" AS ENUM ('LIVE_CHAT', 'MULTI_CAMERA', 'MULTI_TABLE_PLAY');
      CREATE TYPE "table_game_feature" AS ENUM ('LIVE_DEALER', 'AUTO_DEALER', 'MULTI_HAND', 'SIDE_BETS', 'TIME_LIMIT');
      CREATE TYPE "sport_game_feature" AS ENUM ('IN_PLAY', 'CASHOUT_OPTION', 'LIVE_STREAMING', 'VIRTUAL_SPORTS', 'ODDS_BOOST');
      CREATE TYPE "volatility" AS ENUM ('FREE_SPINS', 'MULTIPLIER', 'BONUS_GAME', 'JACKPOT', 'BUY_BONUS');
      CREATE TYPE "session_close_reason" AS ENUM ('GAME_DISABLED', 'PLAYER_BLOCKED', 'MANUAL_CLOSE');
    `);

    await queryRunner.query(/*sql*/ `
      CREATE TABLE "game_vendor" (
        "id" serial PRIMARY KEY,
        "name" varchar(64) NOT NULL,
        "iconId" int4,
        "slug" varchar(64) UNIQUE NOT NULL,
        "languages" varchar(2)[],
        "regions" varchar(2)[]
      );
    `);

    await queryRunner.query(/*sql*/ `
      CREATE TABLE "game_provider" (
        "id" serial PRIMARY KEY,
        "name" varchar(64) NOT NULL,
        "code" varchar(64) UNIQUE NOT NULL
      );
    `);

    await queryRunner.query(/*sql*/ `
      CREATE TABLE "game" (
        "id" serial PRIMARY KEY,
        "vendorId" int4 NOT NULL REFERENCES "game_vendor" ("id"),
        "providerId" int4 NOT NULL REFERENCES "game_provider" ("id"),
        "name" varchar(64) NOT NULL,
        "slug" varchar(64) UNIQUE NOT NULL,
        "code" varchar(64) UNIQUE NOT NULL,
        "types" game_type[] NOT NULL,
        "subType" game_sub_type,
        "currencies" varchar(32)[],
        "regions" varchar(2)[],
        "languages" varchar(2)[],
        "status" game_status DEFAULT 'ENABLED',
        "createdAt" timestamp with time zone DEFAULT NOW(),
        "updatedAt" timestamp with time zone DEFAULT NOW(),
        "deletedAt" timestamp with time zone
      );
    `);

    await queryRunner.query(/*sql*/ `
      CREATE TABLE "slot_game" (
        "gameId" int4 PRIMARY KEY REFERENCES "game" ("id") ON DELETE CASCADE,
        "rpt" numeric(5, 2),
        "minBetUsd" float4,
        "maxBetUsd" float4,
        "volatility" game_volatility,
        "reels" int2,
        "rows" int2,
        "payLines" int2,
        "features" slot_game_feature[]
      );
    `);

    await queryRunner.query(/*sql*/ `
      CREATE TABLE "live_game" (
        "gameId" int4 PRIMARY KEY REFERENCES "game" ("id") ON DELETE CASCADE,
        "dealerLanguageId" int2,
        "minBetUsd" float4,
        "maxBetUsd" float4,
        "maxTablePlayers" int2,
        "maxPlayers" int2,
        "features" live_game_feature[]
      );
    `);

    await queryRunner.query(/*sql*/ `
      CREATE TABLE "table_game" (
        "gameId" int4 PRIMARY KEY REFERENCES "game" ("id") ON DELETE CASCADE,
        "dealerLanguageId" int2,
        "deckCount" int2,
        "jokersCount" int2,
        "minBetUsd" float4,
        "maxBetUsd" float4,
        "maxTablePlayers" int2,
        "maxPlayers" int2,
        "rakePercent" float4,
        "features" table_game_feature[]
      );
    `);

    await queryRunner.query(/*sql*/ `
      CREATE TABLE "lottery_game" (
        "gameId" int4 PRIMARY KEY REFERENCES "game" ("id") ON DELETE CASCADE,
        "ticketPriceUsd" int2,
        "maxPrizeUsd" int2
      );
    `);

    await queryRunner.query(/*sql*/ `
      CREATE TABLE "game_session" (
        "id" BIGSERIAL PRIMARY KEY,
        "externalId" VARCHAR(64) NOT NULL,
        "providerId" INTEGER NOT NULL REFERENCES "game_provider" ("id"),
        "vendorId" INTEGER NOT NULL REFERENCES "game_vendor" ("id"),
        "gameId" INTEGER NOT NULL REFERENCES "game" ("id"),
        "playerId" VARCHAR NOT NULL,
        "accountId" VARCHAR NOT NULL,
        "totalBet" NUMERIC(32, 18) DEFAULT 0 CHECK ("totalBet" >= 0),
        "totalWin" NUMERIC(32, 18) DEFAULT 0 CHECK ("totalWin" >= 0),
        "totalRollback" NUMERIC(32, 18) DEFAULT 0 CHECK ("totalRollback" >= 0),
        "totalBetUsd" NUMERIC(32, 18) DEFAULT 0 CHECK ("totalBetUsd" >= 0),
        "totalWinUsd" NUMERIC(32, 18) DEFAULT 0 CHECK ("totalWinUsd" >= 0),
        "totalRollbackUsd" NUMERIC(32, 18) DEFAULT 0 CHECK ("totalRollbackUsd" >= 0),
        "totalBetCount" INTEGER DEFAULT 0 CHECK ("totalBetCount" >= 0),
        "totalWinCount" INTEGER DEFAULT 0 CHECK ("totalWinCount" >= 0),
        "totalRollbackCount" INTEGER DEFAULT 0 CHECK ("totalRollbackCount" >= 0),
        "accountCurrencyCode" VARCHAR(32) NOT NULL,
        "gameCurrencyCode" VARCHAR(32),
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "activatedAt" TIMESTAMP WITH TIME ZONE,
        "lastBetAt" TIMESTAMP WITH TIME ZONE,
        "closedAt" TIMESTAMP WITH TIME ZONE,
        "closeReason" session_close_reason
      );
    `);

    await queryRunner.query(/*sql*/ `
      CREATE TABLE "jackpot" (
        "jackpotId" serial PRIMARY KEY,
        "amount" numeric(32, 18) NOT NULL CHECK (amount >= 0)
      );
    `);

    await queryRunner.query(/*sql*/ `
      CREATE TABLE "game_transaction" (
        "id" bigserial PRIMARY KEY,
        "sessionId" bigserial NOT NULL REFERENCES "game_session" ("id") ON DELETE CASCADE,
        "balanceTransactionId" bigserial NOT NULL,
        "externalTransactionId" varchar(64) NOT NULL,
        "accountId" varchar(64) NOT NULL,
        "roundId" varchar(64),
        "vendorId" int4 REFERENCES "game_vendor" ("id"),
        "providerId" int4 REFERENCES "game_provider" ("id"),
        "gameId" int4 REFERENCES "game" ("id"),
        "currencyCode" varchar(32),
        "rate" numeric(32, 18),
        "type" varchar(32) NOT NULL,
        "amount" numeric(32) NOT NULL CHECK ("amount" >= 0),
        "amountDecimals" int2 NOT NULL,
        "jackpotId" int4 REFERENCES "jackpot" ("jackpotId"),
        "createdAt" timestamp with time zone DEFAULT NOW()
      );
    `);

    // Create indexes based on common filters
    await queryRunner.query(/*sql*/ `
      CREATE INDEX "idx_game_slug" ON "game" ("slug");
    `);
    await queryRunner.query(/*sql*/ `
      CREATE INDEX "idx_game_session_external_id" ON "game_session" ("externalId");
    `);
    await queryRunner.query(/*sql*/ `
      CREATE INDEX "idx_game_transaction_provider_tx_id" ON "game_transaction" ("externalTransactionId");
    `);

    // Create trigger function and trigger for updatedAt on game table
    await queryRunner.query(/*sql*/ `
      CREATE OR REPLACE FUNCTION "update_updatedAt_column"()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW."updatedAt" = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
    await queryRunner.query(/*sql*/ `
      CREATE TRIGGER "trigger_game_updatedAt"
      BEFORE UPDATE ON "game"
      FOR EACH ROW
      EXECUTE PROCEDURE "update_updatedAt_column"();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove trigger and function
    await queryRunner.query(/*sql*/ `DROP TRIGGER IF EXISTS "trigger_game_updatedAt" ON "game";`);
    await queryRunner.query(/*sql*/ `DROP FUNCTION IF EXISTS "update_updatedAt_column";`);

    // Drop tables in reverse order of dependency
    await queryRunner.query(/*sql*/ `DROP TABLE IF EXISTS "game_transaction";`);
    await queryRunner.query(/*sql*/ `DROP TABLE IF EXISTS "jackpot";`);
    await queryRunner.query(/*sql*/ `DROP TABLE IF EXISTS "game_session";`);
    await queryRunner.query(/*sql*/ `DROP TABLE IF EXISTS "lottery_game";`);
    await queryRunner.query(/*sql*/ `DROP TABLE IF EXISTS "table_game";`);
    await queryRunner.query(/*sql*/ `DROP TABLE IF EXISTS "live_game";`);
    await queryRunner.query(/*sql*/ `DROP TABLE IF EXISTS "slot_game";`);
    await queryRunner.query(/*sql*/ `DROP TABLE IF EXISTS "game";`);
    await queryRunner.query(/*sql*/ `DROP TABLE IF EXISTS "game_provider";`);
    await queryRunner.query(/*sql*/ `DROP TABLE IF EXISTS "game_vendor";`);
    await queryRunner.query(/*sql*/ `DROP TABLE IF EXISTS "currency_exchange";`);

    // Drop ENUM types
    await queryRunner.query(/*sql*/ `DROP TYPE IF EXISTS "volatility";`);
    await queryRunner.query(/*sql*/ `DROP TYPE IF EXISTS "sport_game_feature";`);
    await queryRunner.query(/*sql*/ `DROP TYPE IF EXISTS "table_game_feature";`);
    await queryRunner.query(/*sql*/ `DROP TYPE IF EXISTS "live_game_feature";`);
    await queryRunner.query(/*sql*/ `DROP TYPE IF EXISTS "slot_game_feature";`);
    await queryRunner.query(/*sql*/ `DROP TYPE IF EXISTS "game_volatility";`);
    await queryRunner.query(/*sql*/ `DROP TYPE IF EXISTS "game_status";`);
    await queryRunner.query(/*sql*/ `DROP TYPE IF EXISTS "game_sub_type";`);
    await queryRunner.query(/*sql*/ `DROP TYPE IF EXISTS "game_type";`);
  }
}
