import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PopupWrapper from '@/components/ui/PopupWrapper';
import { db } from '@/lib/db';
import { paginas, configuracionSitio } from '@/lib/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';

// Obtener páginas activas en caché (1 hora)
const getCachedPaginas = unstable_cache(
  async () => {
    return await db
      .select({ href: paginas.slug, label: paginas.titulo })
      .from(paginas)
      .where(and(eq(paginas.activo, true), eq(paginas.mostrarEnMenu, true)))
      .orderBy(asc(paginas.ordenMenu));
  },
  ['layout-paginas'],
  { revalidate: 86400, tags: ['layout-paginas'] }
);

// Obtener configuración del sitio en caché (1 hora)
const getCachedConfig = unstable_cache(
  async () => {
    const configRows = await db.select().from(configuracionSitio).limit(1);
    return configRows[0] || null;
  },
  ['layout-configuracion'],
  { revalidate: 86400, tags: ['layout-configuracion'] }
);

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const paginasActivas = await getCachedPaginas();
  const siteConfig = await getCachedConfig();

  const contactInfo = siteConfig
    ? {
        redesSociales: (siteConfig.redesSociales as any[]) || [],
        telefonos: (siteConfig.telefonos as any[]) || [],
        emails: (siteConfig.emails as any[]) || [],
        direccion: siteConfig.direccion || '',
        mapaEmbedUrl: siteConfig.mapaEmbedUrl || '',
      }
    : undefined;

  // Some links in footer might be specific, but for now we pass the same or derived
  const quickLinks = paginasActivas.filter((link: { href: string }) => link.href !== '/'); // Filter out home for footer usually

  return (
    <>
      <Header navLinks={paginasActivas} contactInfo={contactInfo} />
      <PopupWrapper />
      <main className="flex min-h-screen flex-col">
        {children}
      </main>
      <Footer quickLinks={quickLinks} contactInfo={contactInfo} />
    </>
  );
}
