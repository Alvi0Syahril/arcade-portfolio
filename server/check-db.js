import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' }); // Load from root if running from server dir
dotenv.config(); // fallback

async function check() {
  const client = new Client({
    host: process.env.PGHOST || 'localhost',
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || '121217',
    database: process.env.PGDATABASE || 'portfolio_db',
    port: parseInt(process.env.PGPORT || '5432'),
  });

  try {
    await client.connect();
    console.log("Connected to portfolio_db successfully!\n");

    const tables = ['projects', 'skills', 'experience'];

    for (const table of tables) {
      const res = await client.query(`SELECT * FROM ${table}`);
      console.log(`--- Table: ${table} (${res.rowCount} rows) ---`);
      console.table(res.rows);
      console.log("\n");
    }

  } catch (e) {
    console.error("Error connecting to database:", e);
  } finally {
    await client.end();
  }
}

check();
