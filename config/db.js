import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from'fs';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0, 
  ssl: {
    ca: fs.existsSync('./ca.pem') ? fs.readFileSync('./ca.pem') : undefined,
    rejectUnauthorized: false,
  },
});

export default pool;