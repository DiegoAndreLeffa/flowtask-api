// src/database/data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true, // depois a gente tira
  logging: false,
  entities: ['src/modules/**/entities/*.{ts,js}'],
  migrations: ['src/database/migrations/*.{ts,js}'],
});
