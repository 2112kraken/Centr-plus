import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRbacScheme1739888443115 implements MigrationInterface {
  name = 'CreateRbacScheme1739888443115';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create permission table
    await queryRunner.query(/* sql */ `
      CREATE TABLE "permission" (
        "id" SMALLSERIAL NOT NULL,
        "name" character varying NOT NULL,
        "scope" character varying NOT NULL,
        CONSTRAINT "PK_permission_id" PRIMARY KEY ("id")
      )
    `);

    // Create role table
    await queryRunner.query(/* sql */ `
      CREATE TABLE "role" (
        "id" SMALLSERIAL NOT NULL,
        "name" character varying NOT NULL,
        "scope" character varying NOT NULL,
        CONSTRAINT "PK_role_id" PRIMARY KEY ("id")
      )
    `);

    // Create roles_to_permissions table
    await queryRunner.query(/* sql */ `
      CREATE TABLE "roles_to_permissions" (
        "roleId" smallint NOT NULL,
        "permissionId" smallint NOT NULL,
        CONSTRAINT "PK_roles_to_permissions" PRIMARY KEY ("roleId", "permissionId"),
        CONSTRAINT "FK_roles_to_permissions_role" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_roles_to_permissions_permission" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE CASCADE
      )
    `);

    // Create roles_to_roles table
    await queryRunner.query(/* sql */ `
      CREATE TABLE "roles_to_roles" (
        "parentRoleId" smallint NOT NULL,
        "roleId" smallint NOT NULL,
        CONSTRAINT "PK_roles_to_roles" PRIMARY KEY ("parentRoleId", "roleId"),
        CONSTRAINT "FK_roles_to_roles_parent" FOREIGN KEY ("parentRoleId") REFERENCES "role"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_roles_to_roles_child" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE
      )
    `);

    // Create roles_to_admins table
    await queryRunner.query(/* sql */ `
      CREATE TABLE "roles_to_admins" (
        "roleId" smallint NOT NULL,
        "adminId" bigint NOT NULL,
        CONSTRAINT "PK_roles_to_admins" PRIMARY KEY ("roleId", "adminId"),
        CONSTRAINT "FK_roles_to_admins_role" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_roles_to_admins_admin" FOREIGN KEY ("adminId") REFERENCES "admin"("id") ON DELETE CASCADE
      )
    `);

    // Create roles_to_players table
    await queryRunner.query(/* sql */ `
      CREATE TABLE "roles_to_players" (
        "roleId" smallint NOT NULL,
        "playerId" bigint NOT NULL,
        CONSTRAINT "PK_roles_to_players" PRIMARY KEY ("roleId", "playerId"),
        CONSTRAINT "FK_roles_to_players_role" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_roles_to_players_player" FOREIGN KEY ("playerId") REFERENCES "player"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* sql */ `DROP TABLE "roles_to_players"`);
    await queryRunner.query(/* sql */ `DROP TABLE "roles_to_admins"`);
    await queryRunner.query(/* sql */ `DROP TABLE "roles_to_roles"`);
    await queryRunner.query(/* sql */ `DROP TABLE "roles_to_permissions"`);
    await queryRunner.query(/* sql */ `DROP TABLE "role"`);
    await queryRunner.query(/* sql */ `DROP TABLE "permission"`);
  }
}
