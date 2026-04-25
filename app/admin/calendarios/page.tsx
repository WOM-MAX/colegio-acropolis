export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';
import { calendariosEvaluaciones } from '@/lib/db/schema';
import { asc, eq } from 'drizzle-orm';
import CalendarioRow from './components/CalendarioRow';

export default async function CalendariosPage() {
  const calendarios = await db.select().from(calendariosEvaluaciones).orderBy(asc(calendariosEvaluaciones.orden));

  // Separar los calendarios por ciclo (opcional: o mostrar todo en una sola tabla grande)
  // Como son ~28, una sola tabla es suficiente, pero usemos agrupamiento visual o simplemente la tabla ordenada.
  // Ya están ordenados por "orden" el cual sigue la lógica: parvularia -> basica -> media.

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-negro sm:text-3xl">Calendarios de Evaluaciones</h1>
          <p className="mt-1 text-sm text-gris-texto">
            Administra los enlaces de Google Calendar para cada curso.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-semibold w-1/4">Curso</th>
                <th className="px-6 py-4 font-semibold w-1/4">Ciclo</th>
                <th className="px-6 py-4 font-semibold w-2/4">Enlace de Google Calendar</th>
                <th className="px-6 py-4 text-right font-semibold">Activo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {calendarios.map((cal) => (
                <CalendarioRow key={cal.id} calendario={cal} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-6 rounded-xl bg-azul-soft p-4 border border-azul-acropolis/20">
        <h4 className="font-semibold text-azul-acropolis mb-2">Instrucciones:</h4>
        <ul className="text-sm text-gris-texto list-disc list-inside space-y-1">
          <li>Pasa el mouse sobre el enlace de un curso y haz clic en el icono de editar para pegar la URL del calendario de Google.</li>
          <li>Asegúrate de que el calendario de Google en sus configuraciones tenga los permisos en <b>"Público"</b> para que los apoderados puedan verlo.</li>
          <li>Activa los cursos usando el interruptor de la derecha para que aparezcan en la página principal.</li>
        </ul>
      </div>
    </div>
  );
}
