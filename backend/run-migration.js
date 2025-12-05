import dotenv from 'dotenv';
import fs from 'fs';
import pool from './src/utils/db.js';

dotenv.config();

const runMigration = async () => {
  try {
    const migrationFile = './migrations/20251205_create_engagement_tables.sql';
    const sql = fs.readFileSync(migrationFile, 'utf8');

    console.log('Running migration: 20251205_create_engagement_tables.sql');
    await pool.query(sql);
    console.log('Migration completed successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

runMigration();
