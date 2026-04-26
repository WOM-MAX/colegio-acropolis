export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';
import { galeriaAlbumes, galeriaFotos } from '@/lib/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { Image as ImageIcon, Calendar, Images } from 'lucide-react';
import { formatDateShort } from '@/lib/utils';
import PageHero from '@/components/ui/PageHero';
import Link from 'next/link';

export const metadata = {
  title: 'Galería Fotográfica',
};

export default async function GaleriaPage() {
  // Fetch albums with item count
  const albumes = await db
    .select({
      id: galeriaAlbumes.id,
      titulo: galeriaAlbumes.titulo,
      descripcion: galeriaAlbumes.descripcion,
      portadaUrl: galeriaAlbumes.portadaUrl,
      fecha: galeriaAlbumes.fecha,
      createdAt: galeriaAlbumes.createdAt,
    })
    .from(galeriaAlbumes)
    .where(eq(galeriaAlbumes.activo, true))
    .orderBy(desc(galeriaAlbumes.fecha));

  // Get item counts per album
  const itemCounts = await db
    .select({
      albumId: galeriaFotos.albumId,
      count: sql<number>`count(*)`.as('count'),
    })
    .from(galeriaFotos)
    .groupBy(galeriaFotos.albumId);

  const countMap = new Map(itemCounts.map(ic => [ic.albumId, Number(ic.count)]));

  return (
    <>
      <PageHero
        title="Galería"
        highlight="Institucional"
        description="Recordando los mejores momentos que unen a toda la comunidad."
      />
      <div className="bg-white px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl">
          {albumes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                <Images size={40} className="text-gray-300" />
              </div>
              <h2 className="text-xl font-bold text-negro">Sin álbumes disponibles</h2>
              <p className="mt-2 max-w-md text-gris-texto">
                Pronto se agregarán nuevas galerías fotográficas y de video.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {albumes.map((alb) => {
                const count = countMap.get(alb.id) || 0;
                return (
                  <Link
                    key={alb.id}
                    href={`/galeria/${alb.id}`}
                    className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-gris-claro">
                      {alb.portadaUrl ? (
                        <img
                          src={alb.portadaUrl}
                          alt={alb.titulo}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gray-100 text-gray-300">
                          <ImageIcon size={48} />
                        </div>
                      )}
                      {/* Overlay gradiente */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

                      {/* Info overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="mb-2 flex items-center gap-4">
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-amarillo">
                            <Calendar size={14} />
                            {formatDateShort(alb.fecha || alb.createdAt.toISOString().split('T')[0])}
                          </span>
                          {count > 0 && (
                            <span className="flex items-center gap-1 text-xs font-medium text-white/70">
                              <Images size={13} />
                              {count} elemento{count !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        <h2 className="text-xl font-bold leading-tight text-white">{alb.titulo}</h2>
                        {alb.descripcion && (
                          <p className="mt-2 line-clamp-2 text-sm text-white/80">
                            {alb.descripcion}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
