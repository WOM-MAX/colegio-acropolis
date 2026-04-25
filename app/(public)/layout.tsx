import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PopupWrapper from '@/components/ui/PopupWrapper';
import { db } from '@/lib/db';
import { paginas, configuracionSitio } from '@/lib/db/schema';
import { eq, and, asc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  // Fetch dynamic pages that should be shown in the menu
  const paginasActivas = await db
    .select({ href: paginas.slug, label: paginas.titulo })
    .from(paginas)
    .where(and(eq(paginas.activo, true), eq(paginas.mostrarEnMenu, true)))
    .orderBy(asc(paginas.ordenMenu));

  // Fetch site configuration (social networks, phones, emails)
  const configRows = await db.select().from(configuracionSitio).limit(1);
  const siteConfig = configRows[0] || null;

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
  const quickLinks = paginasActivas.filter(link => link.href !== '/'); // Filter out home for footer usually

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
