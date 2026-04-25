import { config } from 'dotenv';
config({ path: '.env.local' });

import { configuracionSitio } from '../lib/db/schema';

const initialConfig = {
  redesSociales: [
    { plataforma: 'facebook', url: 'https://facebook.com/colegioacropolispuentealto', mostrarEn: 'ambos', orden: 1 },
    { plataforma: 'instagram', url: 'https://instagram.com/colegio_acropolis_oficial', mostrarEn: 'ambos', orden: 2 },
  ],
  telefonos: [
    { etiqueta: 'Principal', numero: '+56 2 2269 1234', tipo: 'fijo' }
  ],
  emails: [
    { etiqueta: 'Contacto', email: 'contacto@colegioacropolis.net' }
  ],
  direccion: 'Puente Alto, Santiago, Chile',
  mapaEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.513575971932!2d-70.58434692430852!3d-33.59196340408544!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662d73fc9ba3bc7%3A0xc3b0704443a75!2sColegio%20Acr%C3%B3polis!5e0!3m2!1ses-419!2scl!4v1713180415250!5m2!1ses-419!2scl',
};

async function seed() {
  console.log('🌱 Seeding configuración del sitio...');
  
  try {
    const { db } = await import('../lib/db');
    const existing = await db.select().from(configuracionSitio).limit(1);
    
    if (existing.length === 0) {
      await db.insert(configuracionSitio).values(initialConfig);
      console.log('✅ Configuración inicial insertada exitosamente');
    } else {
      console.log('ℹ️ La configuración ya existe, no se realizaron cambios');
    }
  } catch (error) {
    console.error('❌ Error al hacer seed de configuración:', error);
  } finally {
    process.exit(0);
  }
}

seed();
