import 'dotenv/config';
import { db } from '../lib/db';
import { configuracionSitio } from '../lib/db/schema';

async function main() {
  const configRows = await db.select().from(configuracionSitio).limit(1);
  console.log('--- Configuracion actual en BD ---');
  console.log(JSON.stringify(configRows[0], null, 2));
  process.exit(0);
}

main().catch(console.error);
