export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';
import { galeriaAlbumes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { updateAlbum } from '../../actions';
import AlbumForm from '../../components/AlbumForm';
import { notFound } from 'next/navigation';

export default async function EditarAlbumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const albumId = parseInt(id, 10);

  let doc;
  try {
    const result = await db.select().from(galeriaAlbumes).where(eq(galeriaAlbumes.id, albumId));
    doc = result[0];
  } catch (error) {
    console.error(error);
  }

  if (!doc) {
    notFound();
  }

  const updateAlbumWithId = updateAlbum.bind(null, doc.id);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-negro">
          Editar Álbum
        </h1>
        <p className="mt-1 text-gris-texto">
          Modifica los detalles del álbum fotográfico.
        </p>
      </div>

      <AlbumForm initialData={doc} action={updateAlbumWithId} />
    </div>
  );
}
