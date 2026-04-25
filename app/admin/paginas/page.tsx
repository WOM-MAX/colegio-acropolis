import { db } from '@/lib/db';
import { paginas } from '@/lib/db/schema';
import { asc } from 'drizzle-orm';
import PaginasTable from './PaginasTable';
import AddPaginaButton from './AddPaginaButton';

export const metadata = {
  title: 'Gestor de Páginas | Admin Acrópolis',
};

export default async function AdminPaginasPage() {
  const todasLasPaginas = await db
    .select()
    .from(paginas)
    .orderBy(asc(paginas.ordenMenu));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-negro">Directorio de Páginas (CMS)</h1>
          <p className="mt-1 text-sm text-gris-texto">
            Administra la visibilidad pública de las páginas institucionales y su aparición en el menú.
          </p>
        </div>
        <AddPaginaButton />
      </div>

      <PaginasTable initialPaginas={todasLasPaginas} />

      <div className="rounded-xl bg-azul-soft p-4 mt-8">
        <p className="text-sm font-medium text-azul-acropolis">
          💡 <strong>Tip de Seguridad:</strong> Si desactivas una página con el Interruptor Maestro, la página dejará de ser accesible incluso si alguien ingresa la URL correcta. Si apagas el ojito, la página no se listará en el menú pero seguirá operativa.
        </p>
      </div>
    </div>
  );
}
