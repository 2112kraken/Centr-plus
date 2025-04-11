import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1735854328221 implements MigrationInterface {
  name = 'Init1735854328221';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `);

    await queryRunner.query(/*sql*/ `
      CREATE TYPE "public"."currency_type_enum" AS ENUM (
        'FIAT', 'CRYPTO', 'INTERNAL'
      )
    `);

    await queryRunner.query(/*sql*/ `
      CREATE TYPE "public"."currency_code_enum" AS ENUM (
        'USD', 'EUR', 'USDT', 'BTC', 'ETH', 'LTC', 'TRX', 'BCH', 'XRP', 'DOGE', 'USDC', 'DAI', 'BNB', 'MATIC', 'SOL', 'AVAX', 'DOT', 'LINK', 'SHIB'
      )
    `);

    await queryRunner.query(/*sql*/ `
      CREATE TYPE "public"."transaction_type_enum" AS ENUM (
        'IN', 'OUT'
      )
    `);

    await queryRunner.query(/*sql*/ `
      CREATE TYPE "public"."transaction_subtype_enum" AS ENUM (
        'DEPOSIT', 'WITHDRAWAL', 'BET', 'WIN', 'ROLLBACK', 'BONUS', 'MANUAL'
      )
    `);

    await queryRunner.query(/*sql*/ `
      CREATE TABLE "account" (
        "id" BIGSERIAL NOT NULL,
        "playerId" bigint NOT NULL,
        "name" varchar(255) NOT NULL,
        "currencyCode" currency_code_enum NOT NULL,
        "balance" numeric(32) NOT NULL DEFAULT 0 CHECK ("balance" >= 0),

        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

        CONSTRAINT "PK_ACCOUNT" PRIMARY KEY ("id"),
        CONSTRAINT "UK_ACCOUNT_NAME" UNIQUE ("name", "playerId")
      );
    `);

    await queryRunner.query(/*sql*/ `
      CREATE TABLE "transaction" (
        "id" BIGSERIAL NOT NULL,
        "rollbackId" varchar(255) NULL,
        "playerId" bigint NOT NULL,
        "triggeredByAdminId" bigint NULL,
        "externalId" varchar(64) NULL,
        "accountId" bigint NOT NULL,
        "type" "public"."transaction_type_enum" NOT NULL,
        "subtype" "public"."transaction_subtype_enum" NOT NULL,
        "amount" numeric(32) NOT NULL DEFAULT 0 CHECK ("amount" >= 0),
        "amountUsd" numeric(32) NOT NULL DEFAULT 0 CHECK ("amountUsd" >= 0),
        "currencyCode" currency_code_enum NOT NULL,
        
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "rollbackAt" TIMESTAMP WITH TIME ZONE NULL,

        CONSTRAINT "PK_TRANSACTION" PRIMARY KEY ("id"),
        CONSTRAINT "UK_TRANSACTION_EXTERNAL_ID" UNIQUE ("externalId"),
        CONSTRAINT "FK_TRANSACTION_ACCOUNT" FOREIGN KEY ("accountId")
          REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `DROP TABLE IF EXISTS "transaction"`);
    await queryRunner.query(/*sql*/ `DROP TABLE IF EXISTS "account"`);
    await queryRunner.query(/*sql*/ `DROP TYPE IF EXISTS "public"."transaction_subtype_enum"`);
    await queryRunner.query(/*sql*/ `DROP TYPE IF EXISTS "public"."transaction_type_enum"`);
    await queryRunner.query(/*sql*/ `DROP TYPE IF EXISTS "public"."currency_type_enum"`);
  }
}
