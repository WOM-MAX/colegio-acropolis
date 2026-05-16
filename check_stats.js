const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

async function check() {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS pg_stat_statements;`;
    const res = await sql`SELECT pid, datname, usename, application_name, client_addr, state, backend_type, query FROM pg_stat_activity`;
    console.log(JSON.stringify(res, null, 2));
  } catch (err) {
    console.error(err);
  }
}
check();
