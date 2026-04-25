import Hero from '@/components/home/Hero';
import EventSlider from '@/components/home/EventSlider';
import JournalGrid from '@/components/home/JournalGrid';
import DownloadsGrid from '@/components/home/DownloadsGrid';
import BannerCTA from '@/components/home/BannerCTA';
import CalendariosSection from '@/components/home/CalendariosSection';
import FadeIn from '@/components/ui/FadeIn';

import { db } from '@/lib/db';
import { paginas, paginaSecciones } from '@/lib/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import BlockRenderer from '@/components/renderer/BlockRenderer';

export const revalidate = 3600;

export default async function HomePage() {
  // 1. Buscar si hay configuración dinámica para el "Inicio" en el CMS
  const [paginaInicio] = await db
    .select()
    .from(paginas)
    .where(eq(paginas.slug, '/'))
    .limit(1);

  // 2. Si existe la página en el CMS, cargamos sus bloques dinámicos activos
  let seccionesDinamicas: any[] = [];
  if (paginaInicio && paginaInicio.activo) {
    seccionesDinamicas = await db
      .select()
      .from(paginaSecciones)
      .where(and(eq(paginaSecciones.paginaId, paginaInicio.id), eq(paginaSecciones.estadoActivo, true)))
      .orderBy(asc(paginaSecciones.orden));
  }

  return (
    <>
      {/* CMS Dinámico: Renderizar bloques insertados desde el Administrador (Ej: Cinta de Noticias) */}
      {seccionesDinamicas.map((seccion) => (
        <BlockRenderer key={seccion.id} seccion={seccion} />
      ))}

      {/* C2: Hero Split-screen azul + amarillo */}
      <FadeIn direction="none" duration={0.8}>
        <Hero />
      </FadeIn>

      {/* C3: Slider de Eventos Carrusel horizontal fucsia */}
      <FadeIn delay={0.1}>
        <EventSlider />
      </FadeIn>

      {/* C4: Grid Journal Ultimas 3 noticias */}
      <FadeIn delay={0.1}>
        <JournalGrid />
      </FadeIn>

      {/* C4.5: Calendarios de Evaluaciones */}
      <FadeIn delay={0.1}>
        <CalendariosSection />
      </FadeIn>

      {/* C5: Descargas Grid 2x2 con botones negros */}
      <FadeIn delay={0.1}>
        <DownloadsGrid />
      </FadeIn>

      {/* C6: Banner CTA Fucsia con blob amarillo */}
      <FadeIn delay={0.2} direction="up">
        <BannerCTA />
      </FadeIn>
    </>
  );
}
