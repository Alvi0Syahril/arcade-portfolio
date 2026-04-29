import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' }); // Load from root if running from server dir
dotenv.config(); // fallback

async function init() {
  const defaultClient = new Client({
    host: process.env.PGHOST || 'localhost',
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || '121217',
    database: 'postgres',
    port: parseInt(process.env.PGPORT || '5432'),
  });

  try {
    await defaultClient.connect();
    await defaultClient.query('DROP DATABASE IF EXISTS portfolio_db');
    await defaultClient.query('CREATE DATABASE portfolio_db');
    console.log("Database 'portfolio_db' created successfully!");
  } catch(e) {
    console.error("Error creating database (it may already exist or there are connection issues):", e);
  } finally {
    await defaultClient.end();
  }

  const targetClient = new Client({
    host: process.env.PGHOST || 'localhost',
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || '121217',
    database: process.env.PGDATABASE || 'portfolio_db',
    port: parseInt(process.env.PGPORT || '5432'),
  });

  try {
    await targetClient.connect();
    
    // Determine path for sql files based on where script is run
    const initSqlPath = fs.existsSync('init.sql') ? 'init.sql' : '../init.sql';
    const seedSqlPath = fs.existsSync('seed_data.sql') ? 'seed_data.sql' : '../seed_data.sql';

    const initSql = fs.readFileSync(initSqlPath, 'utf-8');
    await targetClient.query(initSql);
    console.log("Tables created and initial data inserted!");

    const seedSql = fs.readFileSync(seedSqlPath, 'utf-8');
    await targetClient.query(seedSql);
    console.log("Seed data inserted successfully!");

  } catch(e) {
    console.error("Error creating tables or inserting data:", e);
  } finally {
    await targetClient.end();
  }
}

init();
