import * as dotenv from 'dotenv';

// Load .env file
dotenv.config();

export const databaseConfig = {
  host: process.env.DB_HOST ?? 'mock',
  port: parseInt(process.env.DB_PORT ?? '3306', 10),
  database: process.env.DB_NAME ?? 'saucedemo',
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? 'secret',
};
