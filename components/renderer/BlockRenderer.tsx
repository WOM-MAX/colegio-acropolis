import React from 'react';
import HeroBlock from './blocks/HeroBlock';
import TextBlock from './blocks/TextBlock';
import PageHeaderBlock from './blocks/PageHeaderBlock';
import ImagenTextoBlock from './blocks/ImagenTextoBlock';
import TarjetasBlock from './blocks/TarjetasBlock';
import AcordeonBlock from './blocks/AcordeonBlock';
import CtaBotonesBlock from './blocks/CtaBotonesBlock';
import TestimoniosBlock from './blocks/TestimoniosBlock';
import GaleriaMiniBlock from './blocks/GaleriaMiniBlock';
import EquipoBlock from './blocks/EquipoBlock';
import VideoBlock from './blocks/VideoBlock';
import EstadisticasBlock from './blocks/EstadisticasBlock';
import ContactoInfoBlock from './blocks/ContactoInfoBlock';
import AlertaBlock from './blocks/AlertaBlock';
import EspaciadorBlock from './blocks/EspaciadorBlock';
import CintaNoticiasBlock from './blocks/CintaNoticiasBlock';

// Componentes del Sistema (Página de Inicio)
import Hero from '@/components/home/Hero';
import EventSlider from '@/components/home/EventSlider';
import JournalGrid from '@/components/home/JournalGrid';
import CalendariosSection from '@/components/home/CalendariosSection';
import DownloadsGrid from '@/components/home/DownloadsGrid';
import BannerCTA from '@/components/home/BannerCTA';
import FadeIn from '@/components/ui/FadeIn';

type BlockProps = {
  seccion: {
    id: number;
    paginaId: number;
    tipoBloque: string;
    orden: number;
    configuracion: any;
    createdAt: Date;
    updatedAt: Date;
  };
};

export default function BlockRenderer({ seccion }: BlockProps) {
  switch (seccion.tipoBloque) {
    case 'PAGE_HEADER':
      return <PageHeaderBlock configuracion={seccion.configuracion} />
    case 'IMAGEN_TEXTO':
      return <ImagenTextoBlock configuracion={seccion.configuracion} />
    case 'TARJETAS':
      return <TarjetasBlock configuracion={seccion.configuracion} />
    case 'ACORDEON':
      return <AcordeonBlock configuracion={seccion.configuracion} />
    case 'CTA_BOTONES':
      return <CtaBotonesBlock configuracion={seccion.configuracion} />
    case 'TESTIMONIOS':
      return <TestimoniosBlock configuracion={seccion.configuracion} />
    case 'GALERIA_MINI':
      return <GaleriaMiniBlock configuracion={seccion.configuracion} />
    case 'EQUIPO':
      return <EquipoBlock configuracion={seccion.configuracion} />
    case 'VIDEO':
      return <VideoBlock configuracion={seccion.configuracion} />
    case 'ESTADISTICAS':
      return <EstadisticasBlock configuracion={seccion.configuracion} />
    case 'CONTACTO_INFO':
      return <ContactoInfoBlock configuracion={seccion.configuracion} />
    case 'ALERTA':
      return <AlertaBlock configuracion={seccion.configuracion} />
    case 'ESPACIADOR':
      return <EspaciadorBlock configuracion={seccion.configuracion} />
    case 'CINTA_NOTICIAS':
      return <CintaNoticiasBlock configuracion={seccion.configuracion} />
    case 'HERO':
      return <HeroBlock configuracion={seccion.configuracion} />;
    case 'TEXTO':
      return <TextBlock configuracion={seccion.configuracion} />;
    
    // Secciones Institucionales del Sistema (Página de Inicio)
    case 'HOME_HERO':
      return (
        <FadeIn direction="none" duration={0.8}>
          <Hero />
        </FadeIn>
      );
    case 'HOME_EVENTOS':
      return (
        <FadeIn delay={0.1}>
          <EventSlider />
        </FadeIn>
      );
    case 'HOME_JOURNAL':
      return (
        <FadeIn delay={0.1}>
          <JournalGrid />
        </FadeIn>
      );
    case 'HOME_CALENDARIOS':
      return (
        <FadeIn delay={0.1}>
          <CalendariosSection />
        </FadeIn>
      );
    case 'HOME_DESCARGAS':
      return (
        <FadeIn delay={0.1}>
          <DownloadsGrid />
        </FadeIn>
      );
    case 'HOME_BANNER_CTA':
      return (
        <FadeIn delay={0.2} direction="up">
          <BannerCTA />
        </FadeIn>
      );
    default:
      // Para desarrollo/debug
      console.warn(`[BlockRenderer] Tipo de bloque no soportado: ${seccion.tipoBloque}`);
      return (
        <div className="border border-red-200 bg-red-50 p-4 text-center">
          <p className="text-sm font-semibold text-red-600">
            Bloque temporalmente no soportado ({seccion.tipoBloque})
          </p>
        </div>
      );
  }
}
