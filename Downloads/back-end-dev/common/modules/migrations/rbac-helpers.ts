import { QueryRunner } from 'typeorm';

async function createRoleIfNotExists(queryRunner: QueryRunner, name: string, scope: string): Promise<number> {
  // Check if role exists
  const existingRole = await queryRunner.query(`SELECT id FROM "role" WHERE name = $1 AND scope = $2`, [name, scope]);

  if (existingRole.length > 0) {
    return existingRole[0].id;
  }

  // Create new role
  const result = await queryRunner.query(`INSERT INTO "role" (name, scope) VALUES ($1, $2) RETURNING id`, [
    name,
    scope,
  ]);

  return result[0].id;
}

async function createPermissionIfNotExists(queryRunner: QueryRunner, name: string, scope: string): Promise<number> {
  // Check if permission exists
  const existingPermission = await queryRunner.query(`SELECT id FROM "permission" WHERE name = $1 AND scope = $2`, [
    name,
    scope,
  ]);

  if (existingPermission.length > 0) {
    return existingPermission[0].id;
  }

  // Create new permission
  const result = await queryRunner.query(`INSERT INTO "permission" (name, scope) VALUES ($1, $2) RETURNING id`, [
    name,
    scope,
  ]);

  return result[0].id;
}

/**
 * Create roles, permissions and assign permissions to roles
 * If type of value in array is string need find entity by name if object need create entity
 */
export async function apply(
  scope: string,
  roles: Array<{
    name: string;
    permissions?: string[];
    extends?: Array<{ name: string; permissions: string[] } | string>;
  }>,
  queryRunner: QueryRunner,
): Promise<void> {
  for (const roleData of roles) {
    // Create role
    const roleId = await createRoleIfNotExists(queryRunner, roleData.name, scope);

    // Create and assign permissions
    if (roleData.permissions) {
      for (const permissionName of roleData.permissions) {
        const permissionId = await createPermissionIfNotExists(queryRunner, permissionName, scope);

        // Assign permission to role
        await queryRunner.query(
          `INSERT INTO "roles_to_permissions" ("roleId", "permissionId") 
           VALUES ($1, $2) 
           ON CONFLICT DO NOTHING`,
          [roleId, permissionId],
        );
      }
    }

    // Handle role extensions
    if (roleData.extends) {
      for (const extension of roleData.extends) {
        let extendedRoleId: number;

        if (typeof extension === 'string') {
          // Find existing role
          const existingRole = await queryRunner.query(`SELECT id FROM "role" WHERE name = $1 AND scope = $2`, [
            extension,
            scope,
          ]);
          if (!existingRole.length) {
            throw new Error(`Role ${extension} not found`);
          }
          extendedRoleId = existingRole[0].id;
        } else {
          // Create new role with permissions
          extendedRoleId = await createRoleIfNotExists(queryRunner, extension.name, scope);

          // Create and assign permissions for extended role
          for (const permissionName of extension.permissions) {
            const permissionId = await createPermissionIfNotExists(queryRunner, permissionName, scope);

            await queryRunner.query(
              `INSERT INTO "roles_to_permissions" ("roleId", "permissionId") 
               VALUES ($1, $2) 
               ON CONFLICT DO NOTHING`,
              [extendedRoleId, permissionId],
            );
          }
        }

        // Create role hierarchy
        await queryRunner.query(
          `INSERT INTO "roles_to_roles" ("parentRoleId", "roleId") 
           VALUES ($1, $2) 
           ON CONFLICT DO NOTHING`,
          [roleId, extendedRoleId],
        );
      }
    }
  }
}

/**
 * Remove roles, permissions that was created in apply method
 */
export async function rollback(
  scope: string,
  roles: Array<{
    name: string;
    permissions?: string[];
    extends?: Array<{ name: string; permissions: string[] } | string>;
  }>,
  queryRunner: QueryRunner,
): Promise<void> {
  for (const roleData of roles) {
    // Delete role and its relations (cascade will handle related records)
    await queryRunner.query(`DELETE FROM "role" WHERE name = $1 AND scope = $2`, [roleData.name, scope]);

    // Delete permissions
    if (roleData.permissions) {
      for (const permissionName of roleData.permissions) {
        await queryRunner.query(`DELETE FROM "permission" WHERE name = $1 AND scope = $2`, [permissionName, scope]);
      }
    }

    // Handle extended roles
    if (roleData.extends) {
      for (const extension of roleData.extends) {
        if (typeof extension === 'object') {
          await queryRunner.query(`DELETE FROM "role" WHERE name = $1 AND scope = $2`, [extension.name, scope]);

          for (const permissionName of extension.permissions) {
            await queryRunner.query(`DELETE FROM "permission" WHERE name = $1 AND scope = $2`, [permissionName, scope]);
          }
        }
      }
    }
  }
}
