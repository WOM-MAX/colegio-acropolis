import { db } from '../lib/db';
import { configuracionSitio } from '../lib/db/schema';

async function main() {
  await db.update(configuracionSitio).set({
    direccion: 'Ángel Pimentel 01003, Puente Alto, Santiago, Chile',
    mapaEmbedUrl: 'https://www.google.com/maps?q=-33.5892190,-70.5671978&output=embed&z=16'
  });
  console.log('Mapa actualizado en la base de datos');
  process.exit(0);
}

main().catch(console.error);
