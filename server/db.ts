import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// PostgreSQL Pool handles both discrete env variables AND connection strings (DATABASE_URL)
const poolConfig = process.env.DATABASE_URL 
  ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
  : {
      host: process.env.PGHOST || 'localhost',
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || 'postgres',
      database: process.env.PGDATABASE || 'portfolio_db',
      port: parseInt(process.env.PGPORT || '5432'),
    };

const pool = new Pool(poolConfig);

// Verification log
pool.on('connect', () => {
  console.log('🐘 PostgreSQL Pool Connected');
});

export default pool;
