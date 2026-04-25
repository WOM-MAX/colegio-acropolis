import 'dotenv/config';
import { db } from '../lib/db';
import { paginas } from '../lib/db/schema';

// Las 7 páginas clave del colegio
// 1. Inicio
// 2. Nuestra Historia (Inactiva por instrucción)
// 3. Coordinaciones
// 4. Noticias (Journal)
// 5. Centro de Padres (Inactiva por instrucción)
// 6. Galería
// 7. Admisión
const paginasIniciales = [
  {
    titulo: 'Inicio',
    slug: '/',
    activo: true,
    mostrarEnMenu: true,
    ordenMenu: 1,
    seoDescription: 'Portal institucional del Colegio Acrópolis. Inicio.',
  },
  {
    titulo: 'Nuestra Historia',
    slug: '/nuestra-historia',
    activo: false, // APAGADO 
    mostrarEnMenu: false, // OCULTO DEL MENU
    ordenMenu: 2,
    seoDescription: 'Conoce los hitos, fundación y evolución de nuestro establecimiento.',
  },
  {
    titulo: 'Coordinaciones',
    slug: '/coordinaciones',
    activo: true,
    mostrarEnMenu: true,
    ordenMenu: 3,
    seoDescription: 'Conoce al equipo de coordinación que hace posible la excelencia académica en el Colegio Acrópolis.',
  },
  {
    titulo: 'Noticias',
    slug: '/journal',
    activo: true,
    mostrarEnMenu: true,
    ordenMenu: 4,
    seoDescription: 'Mantente al día con las últimas noticias y avisos importantes del Colegio Acrópolis.',
  },
  {
    titulo: 'Centro de Padres',
    slug: '/centro-de-padres',
    activo: false, // APAGADO (Para evitar ver elecciones recientes o en proceso)
    mostrarEnMenu: false, // OCULTO DEL MENÚ
    ordenMenu: 5,
    seoDescription: 'Información oficial del Centro General de Padres y Apoderados.',
  },
  {
    titulo: 'Galería',
    slug: '/galeria',
    activo: true,
    mostrarEnMenu: true,
    ordenMenu: 6,
    seoDescription: 'Explora nuestra galería visual con fotos de eventos y actividades.',
  },
  {
    titulo: 'Admisión',
    slug: '/admision',
    activo: true,
    mostrarEnMenu: true,
    ordenMenu: 7,
    seoDescription: 'Información y requisitos sobre el proceso de matrícula y admisión en el Colegio Acrópolis.',
  }
];

async function seedPaginas() {
  console.log('Iniciando el poblado (seeding) de páginas base...');
  
  try {
    for (const pagina of paginasIniciales) {
      await db.insert(paginas)
        .values(pagina)
        .onConflictDoNothing({ target: paginas.slug }); 
      // onConflictDoNothing evita errores si ya existe
      console.log(`[OK] Página insertada/verificada: ${pagina.titulo} (${pagina.slug})`);
    }
    console.log('✅ ¡Poblado de páginas completado exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error poblado páginas:', error);
    process.exit(1);
  }
}

seedPaginas();
