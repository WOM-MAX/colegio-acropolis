import { db } from '@/lib/db';
import { descargas, descargasCategorias } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { updateDescarga } from '../../actions';
import DescargaForm from '../../components/DescargaForm';
import { notFound } from 'next/navigation';

export default async function EditarDescargaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const descargaId = parseInt(id, 10);

  let doc;
  try {
    const result = await db.select().from(descargas).where(eq(descargas.id, descargaId));
    doc = result[0];
  } catch (error) {
    console.error(error);
  }

  if (!doc) {
    notFound();
  }

  const categorias = await db.query.descargasCategorias.findMany({
    orderBy: [desc(descargasCategorias.orden)],
  });

  const updateDescargaWithId = updateDescarga.bind(null, doc.id);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-negro">
          Editar Documento / Descarga
        </h1>
        <p className="mt-1 text-gris-texto">
          Modifica los detalles del archivo ingresado.
        </p>
      </div>

      <DescargaForm categorias={categorias} initialData={doc} action={updateDescargaWithId} />
    </div>
  );
}
