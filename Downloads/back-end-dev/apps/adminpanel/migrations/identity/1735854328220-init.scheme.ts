import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1735854328220 implements MigrationInterface {
  name = 'Init1735854328220';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(/*sql*/ `
      CREATE TYPE "public"."player_lang2_enum" AS ENUM (
        'EN', 'ES', 'ZH', 'HI', 'AR', 'BN', 'PT', 'RU', 'JA', 'DE',
        'FR', 'UK', 'IT', 'KO', 'VI', 'TR', 'FA', 'PL', 'NL', 'TH'
      )
    `);

    await queryRunner.query(/*sql*/ `
      CREATE TYPE "public"."contact_type_enum" AS ENUM ('EMAIL', 'PHONE')
    `);

    await queryRunner.query(/*sql*/ `
      CREATE TYPE "public"."contact_source_enum" AS ENUM ('MANUAL', 'REGISTRATION', 'IMPORT')
    `);

    await queryRunner.query(/*sql*/ `
      CREATE TABLE "player" (
        "id" BIGSERIAL NOT NULL,
        "infoId" bigint NULL,
        "normalizedUsername" varchar(32) NOT NULL,
        "username" varchar(32) NOT NULL,
        "passwordHash" varchar(64) NOT NULL,
        "isActive" boolean NOT NULL DEFAULT true,
        "lang2" "public"."player_lang2_enum" NOT NULL DEFAULT 'EN',
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

        CONSTRAINT "PK_PLAYER" PRIMARY KEY ("id"),
        CONSTRAINT "UK_PLAYER_NORMALIZED_USERNAME" UNIQUE ("normalizedUsername"),
        CONSTRAINT "UK_PLAYER_USERNAME" UNIQUE ("username")
      );

      CREATE INDEX "IDX_PLAYER_IS_ACTIVE" ON "player" ("isActive", "id") WHERE "isActive" = true;
      CREATE INDEX "IDX_PLAYER_CREATED_AT" ON "player" ("createdAt" DESC, "id");
      CREATE INDEX "IDX_PLAYER_INFO_ID" ON "player" ("infoId", "id") WHERE "infoId" IS NOT NULL;
      CREATE INDEX "IDX_PLAYER_NORMALIZED_USERNAME_SEARCH" ON "player" (lower("normalizedUsername") varchar_pattern_ops);
      CREATE INDEX "IDX_PLAYER_IDENTITY" ON "player" ("normalizedUsername", "passwordHash") WHERE "isActive" = true;
    `);

    await queryRunner.query(/*sql*/ `
      CREATE TABLE "player_block_info" (
      "id" BIGSERIAL NOT NULL,
      "playerId" bigint NOT NULL,
      "reason" varchar(255) NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

      CONSTRAINT "PK_PLAYER_BLOCK_INFO" PRIMARY KEY ("id"),
      CONSTRAINT "FK_PLAYER_BLOCK_INFO_PLAYER_ID" FOREIGN KEY ("playerId")
        REFERENCES "player"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );

      CREATE INDEX "IDX_PLAYER_BLOCK_INFO_PLAYER_ID" ON "player_block_info" ("playerId");
      CREATE INDEX "IDX_PLAYER_BLOCK_INFO_CREATED_AT" ON "player_block_info" ("createdAt" DESC);
    `);

    await queryRunner.query(/*sql*/ `
      CREATE TABLE "player_info" (
        "id" BIGSERIAL NOT NULL,
        "playerId" bigint NOT NULL,
        "firstName" varchar(64) NOT NULL,
        "lastName" varchar(64) NOT NULL,
        "middleName" varchar(64) NULL,
        "dateOfBirth" DATE NOT NULL,
        "countryCode" char(2) NOT NULL,
        "city" varchar(85) NOT NULL,
        "address" varchar(200) NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

        CONSTRAINT "PK_PLAYER_INFO" PRIMARY KEY ("id"),
        CONSTRAINT "UK_PLAYER_INFO_PLAYER_ID" UNIQUE ("playerId"),
        CONSTRAINT "FK_PLAYER_INFO_PLAYER_ID" FOREIGN KEY ("playerId")
          REFERENCES "player"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
      CREATE INDEX "IDX_PLAYER_INFO_COUNTRY_CODE" ON "player_info" ("countryCode", "city");
      CREATE INDEX "IDX_PLAYER_INFO_NAME_SEARCH" ON "player_info" ("lastName", "firstName");
    `);

    await queryRunner.query(/*sql*/ `
      CREATE TABLE "player_contact" (
        "id" BIGSERIAL NOT NULL,
        "playerId" bigint NOT NULL,
        "type" "public"."contact_type_enum" NOT NULL,
        "value" varchar(254) NOT NULL,
        "source" "public"."contact_source_enum" NOT NULL DEFAULT 'MANUAL',
        "isMain" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "verifiedAt" TIMESTAMP WITH TIME ZONE NULL,
        "deletedAt" TIMESTAMP WITH TIME ZONE NULL,

        CONSTRAINT "PK_PLAYER_CONTACT" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_CONTACT_UNIQUE" UNIQUE ("value", "type"),
        CONSTRAINT "UQ_MAIN_CONTACT_BY_TYPE" UNIQUE ("playerId", "type", "isMain"),
        CONSTRAINT "FK_PLAYER_CONTACT_PLAYER" FOREIGN KEY ("playerId") 
          REFERENCES "player"("id") ON DELETE CASCADE ON UPDATE CASCADE
      )
    `);

    await queryRunner.query(/*sql*/ `
      CREATE TABLE "admin" (
        "id" BIGSERIAL NOT NULL,
        "passwordHash" varchar(64) NOT NULL,
        "isActive" boolean NOT NULL DEFAULT true,
        "adminId" integer NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

        CONSTRAINT "PK_ADMIN" PRIMARY KEY ("id"),
        CONSTRAINT "FK_ADMIN_CREATED_BY" FOREIGN KEY ("adminId")
          REFERENCES "admin"("id") ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT "CK_ADMIN_SELF_REFERENCE" CHECK ("id" != "adminId")
      );
      CREATE UNIQUE INDEX "UK_ADMIN_ADMIN_ID" ON "admin" ("adminId") WHERE "adminId" IS NOT NULL;
      CREATE INDEX "IDX_ADMIN_IS_ACTIVE" ON "admin" ("isActive", "id") WHERE "isActive" = true;
    `);

    await queryRunner.query(/*sql*/ `
      CREATE TABLE "admin_contact" (
        "id" BIGSERIAL NOT NULL,
        "adminId" bigint NOT NULL,
        "type" "public"."contact_type_enum" NOT NULL,
        "value" varchar(254) NOT NULL,
        "source" "public"."contact_source_enum" NOT NULL DEFAULT 'MANUAL',
        "isMain" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "verifiedAt" TIMESTAMP WITH TIME ZONE NULL,
        "deletedAt" TIMESTAMP WITH TIME ZONE NULL,

        CONSTRAINT "PK_ADMIN_CONTACT" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_ADMIN_CONTACT_UNIQUE" UNIQUE ("value", "type"),
        CONSTRAINT "UQ_ADMIN_MAIN_CONTACT_BY_TYPE" UNIQUE ("adminId", "type", "isMain"),
        CONSTRAINT "FK_ADMIN_CONTACT_ADMIN" FOREIGN KEY ("adminId") 
          REFERENCES "admin"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
      CREATE INDEX "IDX_ADMIN_CONTACT_VALUE" ON "admin_contact" ("value") WHERE "deletedAt" IS NULL;
      CREATE INDEX "IDX_ADMIN_CONTACT_ADMIN_ID" ON "admin_contact" ("adminId") WHERE "deletedAt" IS NULL;
    `);

    await queryRunner.query(/*sql*/ `
      CREATE TABLE "session" (
        "sessionId" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "sessionHash" varchar(64) NOT NULL,
        "playerId" bigint NULL,
        "adminId" integer NULL,
        "isActive" boolean NOT NULL DEFAULT true,
        "userAgent" varchar(255) NULL,
        "ipAddress" varchar(45) NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,

        CONSTRAINT "PK_SESSION" PRIMARY KEY ("sessionId"),
        CONSTRAINT "FK_SESSION_PLAYER_ID" FOREIGN KEY ("playerId")
          REFERENCES "player"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "FK_SESSION_ADMIN_ID" FOREIGN KEY ("adminId")
          REFERENCES "admin"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "CK_SESSION_USER_TYPE" CHECK (
          ("playerId" IS NOT NULL AND "adminId" IS NULL) OR
          ("adminId" IS NOT NULL AND "playerId" IS NULL) OR
          ("playerId" IS NULL AND "adminId" IS NULL)
        )
      );

      CREATE INDEX "IDX_SESSION_PLAYER_ID" ON "session" ("playerId", "isActive", "expiresAt") WHERE "playerId" IS NOT NULL AND "isActive" = true;
      CREATE INDEX "IDX_SESSION_ADMIN_ID" ON "session" ("adminId", "isActive", "expiresAt") WHERE "adminId" IS NOT NULL AND "isActive" = true;
      CREATE INDEX "IDX_SESSION_CLEANUP" ON "session" ("isActive", "expiresAt") WHERE "isActive" = true;
      CREATE INDEX "IDX_SESSION_IP" ON "session" ("ipAddress") WHERE "ipAddress" IS NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `DROP TABLE IF EXISTS "session"`);
    await queryRunner.query(/*sql*/ `DROP TABLE IF EXISTS "admin_contact"`);
    await queryRunner.query(/*sql*/ `DROP TABLE IF EXISTS "admin"`);
    await queryRunner.query(/*sql*/ `DROP TABLE IF EXISTS "player_info"`);
    await queryRunner.query(/*sql*/ `DROP TABLE IF EXISTS "player_contact"`);
    await queryRunner.query(/*sql*/ `DROP TABLE IF EXISTS "player"`);
    await queryRunner.query(/*sql*/ `DROP TYPE IF EXISTS "public"."contact_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."contact_source_enum"`);
    await queryRunner.query(/*sql*/ `DROP TYPE IF EXISTS "public"."player_lang2_enum"`);
  }
}
