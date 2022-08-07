import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

const connection = new Pool({
    user: process.env.PG_USER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: process.env.PG_PORT,
    database: process.env.DATABASE
  });

export { connection }