import { config } from 'dotenv';
import { join } from 'node:path';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

if (!process.env.APP_NAME) {
  throw new Error('APP_NAME is required');
}

if (process.env.NODE_ENV === 'local') {
  const path = join(__dirname, 'apps', process.env.APP_NAME, `.env.${process.env.NODE_ENV}`);
  config({ path });
  console.log(`datasource migration env: ${path}`);
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT || '5432', 10),
  username: process.env.PG_MIGRATION_USERNAME,
  password: process.env.PG_MIGRATION_PASSWORD,
  database: process.env.PG_DATABASE,
  synchronize: false,
  logging: true,
  migrationsTransactionMode: 'each',
  entities: [join(__dirname, 'apps', process.env.APP_NAME, '/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, 'apps', process.env.APP_NAME, 'migrations/**/*{.ts,.js}')],
});
