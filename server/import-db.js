import mysql from 'mysql2/promise';
import fs from 'fs';

async function init() {
  const sql = fs.readFileSync('init.sql', 'utf-8');
  const pool = mysql.createPool({ host: 'localhost', user: 'root', password: '', multipleStatements: true });
  
  try {
     const connection = await pool.getConnection();
     await connection.query(sql);
     connection.release();
     console.log("Database initialized successfully!");
  } catch(e) {
     console.error(e);
  } finally {
     pool.end();
  }
}
init();
