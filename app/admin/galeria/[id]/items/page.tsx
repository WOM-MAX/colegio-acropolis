export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';
import { galeriaAlbumes, galeriaFotos } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Play } from 'lucide-react';
import DeleteFormButton from '@/app/admin/components/DeleteFormButton';
import GaleriaItemForm from './components/GaleriaItemForm';
import { createGaleriaItem, createMultipleGaleriaItems, deleteGaleriaItem } from './actions';

export default async function GaleriaItemsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const albumId = parseInt(id, 10);

  // Obtener álbum
  const albumResult = await db
    .select()
    .from(galeriaAlbumes)
    .where(eq(galeriaAlbumes.id, albumId));
  const album = albumResult[0];
  if (!album) notFound();

  // Obtener items del álbum
  const items = await db
    .select()
    .from(galeriaFotos)
    .where(eq(galeriaFotos.albumId, albumId))
    .orderBy(asc(galeriaFotos.orden));

  const createItemBound = createGaleriaItem.bind(null, albumId);
  const createMultipleBound = createMultipleGaleriaItems.bind(null, albumId);

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Link
            href="/admin/galeria"
            className="mb-2 inline-flex items-center gap-1 text-sm text-gris-texto transition-colors hover:text-azul-acropolis"
          >
            <ArrowLeft size={16} />
            Volver a Galería
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-negro">
            {album.titulo}
          </h1>
          <p className="mt-1 text-sm text-gris-texto">
            Gestiona las fotografías y videos de este álbum. ({items.length} elemento{items.length !== 1 ? 's' : ''})
          </p>
        </div>
      </div>

      {/* Formulario para agregar */}
      <div className="mb-8">
        <GaleriaItemForm
          albumId={albumId}
          addSingleAction={createItemBound}
          addMultipleAction={createMultipleBound}
        />
      </div>

      {/* Grilla de items existentes */}
      {items.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-bold text-negro">
            Contenido del Álbum
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={item.imagenUrl}
                    alt={item.caption || 'Galería'}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {item.tipo === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-azul-acropolis shadow-lg">
                        <Play size={20} fill="currentColor" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Info + Delete */}
                <div className="flex items-center justify-between p-3">
                  <div className="min-w-0 flex-1">
                    {item.caption && (
                      <p className="truncate text-xs font-medium text-negro">
                        {item.caption}
                      </p>
                    )}
                    <span className="text-[11px] font-semibold uppercase text-gris-texto">
                      {item.tipo === 'video' ? '🎬 Video' : '📷 Foto'}
                    </span>
                  </div>
                  <DeleteFormButton
                    id={item.id}
                    action={deleteGaleriaItem.bind(null, albumId)}
                    confirmMessage="¿Eliminar este recurso del álbum?"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
