import fs from 'node:fs/promises';
import {Pool} from 'pg';
if (!process.env.DATABASE_URL) process.loadEnvFile('.env.local');
if (!process.env.DATABASE_URL) throw Error('DATABASE_URL is required');
const pool=new Pool({connectionString:process.env.DATABASE_URL,max:1});
try { await pool.query(await fs.readFile(new URL('../migrations/001_business.sql',import.meta.url),'utf8'));console.log('Business schema is ready.'); } finally {await pool.end();}
