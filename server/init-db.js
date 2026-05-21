import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeDatabase() {
  console.log("Starting database initialization...");

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false },
    multipleStatements: true // Required to run the whole schema.sql at once
  });

  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    let schema = fs.readFileSync(schemaPath, 'utf8');

    // Remove CREATE DATABASE and USE statements if they exist, 
    // as we are already connected to 'defaultdb' or the target db
    schema = schema.replace(/CREATE DATABASE IF NOT EXISTS.*;/gi, '');
    schema = schema.replace(/USE.*;/gi, '');

    console.log("Executing schema.sql...");
    await connection.query(schema);
    
    console.log("Executing seed_kanji.sql...");
    const seedPath = path.join(__dirname, '../seed_kanji.sql');
    if (fs.existsSync(seedPath)) {
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      await connection.query(seedSql);
      console.log("✅ Database seeded successfully!");
    } else {
      console.warn("⚠️ seed_kanji.sql not found, skipping seeding.");
    }
    
    console.log("✅ Database initialized successfully!");
  } catch (err) {
    console.error("❌ Error initializing database:", err);
  } finally {
    await connection.end();
  }
}

initializeDatabase();
