import { db } from '@/lib/db';
import { eventos } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { updateEvento } from '../../actions';
import EventoForm from '../../components/EventoForm';
import { notFound } from 'next/navigation';

export default async function EditarEventoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const eventoId = parseInt(id, 10);

  let doc;
  try {
    const result = await db.select().from(eventos).where(eq(eventos.id, eventoId));
    doc = result[0];
  } catch (error) {
    console.error(error);
  }

  if (!doc) {
    notFound();
  }

  const updateEventoWithId = updateEvento.bind(null, doc.id);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-negro">
          Editar Evento
        </h1>
        <p className="mt-1 text-gris-texto">
          Modifica los detalles del evento seleccionado.
        </p>
      </div>

      <EventoForm initialData={doc} action={updateEventoWithId} />
    </div>
  );
}
