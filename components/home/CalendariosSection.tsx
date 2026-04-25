import { db } from '@/lib/db';
import { calendariosEvaluaciones } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';
import CalendariosTabsClient from './CalendariosTabsClient';

export default async function CalendariosSection() {
  const activos = await db
    .select()
    .from(calendariosEvaluaciones)
    .where(eq(calendariosEvaluaciones.activo, true))
    .orderBy(asc(calendariosEvaluaciones.orden));

  if (activos.length === 0) {
    return null;
  }

  const ciclos = [
    'Educación Parvularia',
    'Enseñanza Básica',
    'Enseñanza Media',
  ];

  const agrupados = ciclos
    .map(nombreCiclo => ({
      nombre: nombreCiclo,
      cursos: activos
        .filter(cal => cal.ciclo === nombreCiclo)
        .map(cal => ({
          id: cal.id,
          curso: cal.curso,
          enlace: cal.enlace,
          ciclo: cal.ciclo,
        })),
    }))
    .filter(grupo => grupo.cursos.length > 0);

  if (agrupados.length === 0) {
    return null;
  }

  return <CalendariosTabsClient grupos={agrupados} />;
}
