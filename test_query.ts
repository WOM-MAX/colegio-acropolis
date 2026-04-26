import { neon } from '@neondatabase/serverless';
import 'dotenv/config';
const sql = neon(process.env.DATABASE_URL);
sql`SELECT id, nombre, imagen_url FROM eventos ORDER BY id DESC LIMIT 5`.then(console.log).catch(console.error);
