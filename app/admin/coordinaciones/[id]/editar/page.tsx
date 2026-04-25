import { db } from '@/lib/db';
import { coordinaciones } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { updateCoordinacion } from '../../actions';
import CoordinacionForm from '../../components/CoordinacionForm';
import { notFound } from 'next/navigation';

export default async function EditarCoordinacionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const coordinacionId = parseInt(id, 10);

  let doc;
  try {
    const result = await db.select().from(coordinaciones).where(eq(coordinaciones.id, coordinacionId));
    doc = result[0];
  } catch (error) {
    console.error(error);
  }

  if (!doc) {
    notFound();
  }

  const updateCoordinacionWithId = updateCoordinacion.bind(null, doc.id);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-negro">
          Editar Coordinación
        </h1>
        <p className="mt-1 text-gris-texto">
          Modifica los detalles de la unidad de coordinación.
        </p>
      </div>

      <CoordinacionForm initialData={doc} action={updateCoordinacionWithId} />
    </div>
  );
}
