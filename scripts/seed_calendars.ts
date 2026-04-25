import 'dotenv/config';
import { db } from '../lib/db';
import { calendariosEvaluaciones } from '../lib/db/schema';

// Cursos según las reglas dadas
const parvularia = [
  'Pre Kínder A',
  'Pre Kínder B',
  'Kínder A',
  'Kínder B'
].map((curso, i) => ({ curso, ciclo: 'Educación Parvularia', orden: i, activo: false }));

const basica = [
  ...Array.from({ length: 8 }).flatMap((_, i) => [
    { curso: `${i + 1}º Básico A`, ciclo: 'Enseñanza Básica', orden: i * 2, activo: false },
    { curso: `${i + 1}º Básico B`, ciclo: 'Enseñanza Básica', orden: i * 2 + 1, activo: false }
  ])
];

const media = [
  ...Array.from({ length: 4 }).flatMap((_, i) => [
    { curso: `${i + 1}º Medio A`, ciclo: 'Enseñanza Media', orden: i * 2, activo: false },
    { curso: `${i + 1}º Medio B`, ciclo: 'Enseñanza Media', orden: i * 2 + 1, activo: false }
  ])
];

const todosLosCursos = [...parvularia, ...basica, ...media];

async function seed() {
  console.log('Seeding calendarios...');
  try {
    // Inserta ignorando si ya existen (opcional: limpiar antes, pero para no romper otras cosas solo insertamos)
    await db.insert(calendariosEvaluaciones).values(todosLosCursos);
    console.log(`✅ ¡Se sembraron ${todosLosCursos.length} cursos!`);
  } catch (error) {
    console.error('⨯ Error sembrando calendarios:', error);
  }
}

seed();
