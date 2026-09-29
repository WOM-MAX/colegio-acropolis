import { createPopup } from '../actions';
import PopupForm from '../components/PopupForm';
import { db } from '@/lib/db';
import { paginas } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';

export default async function NuevoPopupPage() {
  const paginasDisponibles = await db
    .select({ slug: paginas.slug, titulo: paginas.titulo })
    .from(paginas)
    .where(eq(paginas.activo, true))
    .orderBy(asc(paginas.titulo));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-negro">
          Nuevo Popup
        </h1>
        <p className="mt-1 text-gris-texto">
          Crea una nueva ventana emergente para la web.
        </p>
      </div>

      <PopupForm action={createPopup} paginasDisponibles={paginasDisponibles} />
    </div>
  );
}
