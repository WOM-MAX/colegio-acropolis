export const revalidate = 3600;
import { unstable_cache } from 'next/cache';
import { db } from '@/lib/db';
import { galeriaAlbumes, galeriaFotos } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Images } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import GaleriaViewer from './GaleriaViewer';

const getCachedGaleriaAlbum = unstable_cache(
  async (albumId: number) => {
    const result = await db.select().from(galeriaAlbumes).where(eq(galeriaAlbumes.id, albumId));
    return result[0];
  },
  ['galeria-album'],
  { revalidate: 3600 }
);

const getValidGaleriaIds = unstable_cache(
  async () => {
    try {
      const res = await db.select({ id: galeriaAlbumes.id }).from(galeriaAlbumes).where(eq(galeriaAlbumes.activo, true));
      return res.map((a) => a.id.toString());
    } catch (e) {
      return [];
    }
  },
  ['all-valid-galeria-ids'],
  { revalidate: 3600, tags: ['galeria'] }
);

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const validIds = await getValidGaleriaIds();
  if (!validIds.includes(id)) {
    return { title: 'Galería no encontrada' };
  }

  const albumId = parseInt(id, 10);
  const album = await getCachedGaleriaAlbum(albumId);
  return {
    title: album ? `${album.titulo} — Galería` : 'Galería',
  };
}

const getCachedGaleriaFotos = unstable_cache(
  async (albumId: number) => {
    return db
      .select()
      .from(galeriaFotos)
      .where(eq(galeriaFotos.albumId, albumId))
      .orderBy(asc(galeriaFotos.orden));
  },
  ['galeria-fotos'],
  { revalidate: 3600 }
);

export default async function AlbumDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const validIds = await getValidGaleriaIds();
  if (!validIds.includes(id)) {
    notFound();
  }

  const albumId = parseInt(id, 10);

  const album = await getCachedGaleriaAlbum(albumId);

  if (!album || !album.activo) notFound();

  const items = await getCachedGaleriaFotos(albumId);

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
