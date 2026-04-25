import { db } from '@/lib/db';
import { centroPadresDirectiva } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { updateDirectiva } from '../../actions';
import DirectivaForm from '../../components/DirectivaForm';
import { notFound } from 'next/navigation';

export default async function EditarDirectivaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const directivaId = parseInt(id, 10);

  let doc;
  try {
    const result = await db.select().from(centroPadresDirectiva).where(eq(centroPadresDirectiva.id, directivaId));
    doc = result[0];
  } catch (error) {
    console.error(error);
  }

  if (!doc) {
    notFound();
  }

  const updateDirectivaWithId = updateDirectiva.bind(null, doc.id);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-negro">
          Editar Miembro
        </h1>
        <p className="mt-1 text-gris-texto">
          Actualiza los datos del integrante de la directiva.
        </p>
      </div>

      <DirectivaForm initialData={doc} action={updateDirectivaWithId} />
    </div>
  );
}
