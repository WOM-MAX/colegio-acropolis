export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';
import { galeriaAlbumes, galeriaFotos } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Images } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import GaleriaViewer from './GaleriaViewer';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const albumId = parseInt(id, 10);
  const result = await db.select().from(galeriaAlbumes).where(eq(galeriaAlbumes.id, albumId));
  const album = result[0];
  return {
    title: album ? `${album.titulo} — Galería` : 'Galería',
  };
}

export default async function AlbumDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const albumId = parseInt(id, 10);

  const albumResult = await db
    .select()
    .from(galeriaAlbumes)
    .where(eq(galeriaAlbumes.id, albumId));
  const album = albumResult[0];

  if (!album || !album.activo) notFound();

  const items = await db
    .select()
    .from(galeriaFotos)
    .where(eq(galeriaFotos.albumId, albumId))
    .orderBy(asc(galeriaFotos.orden));

  return (
    <>
      <PageHero
        title={album.titulo}
        description={album.descripcion || 'Galería audiovisual del colegio.'}
      />

      <div className="bg-white px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl">
          {/* Back link */}
          <Link
            href="/galeria"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gris-texto transition-colors hover:text-azul-acropolis"
          >
            <ArrowLeft size={16} />
            Volver a la Galería
          </Link>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                <Images size={40} className="text-gray-300" />
              </div>
              <h2 className="text-xl font-bold text-negro">Álbum vacío</h2>
              <p className="mt-2 max-w-md text-gris-texto">
                Este álbum aún no tiene contenido multimedia. Pronto se agregarán nuevas fotografías y videos.
              </p>
            </div>
          ) : (
            <GaleriaViewer items={items.map(i => ({
              id: i.id,
              tipo: i.tipo,
              imagenUrl: i.imagenUrl,
              videoUrl: i.videoUrl,
              caption: i.caption,
            }))} />
          )}
        </div>
      </div>
    </>
  );
}
