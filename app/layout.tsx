import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { db } from '@/lib/db';
import { configuracionSitio } from '@/lib/db/schema';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.colegioacropolis.net'),
  title: {
    default: 'Colegio Acrópolis — Puente Alto, Santiago',
    template: '%s | Colegio Acrópolis',
  },
  description:
    'Portal institucional del Colegio Acrópolis, ubicado en Puente Alto, Santiago de Chile. Noticias, eventos, coordinaciones y recursos para nuestra comunidad escolar.',
  keywords: [
    'Colegio Acrópolis',
    'Puente Alto',
    'colegio Santiago',
    'educación Chile',
    'matrícula escolar',
  ],
  authors: [{ name: 'Colegio Acrópolis' }],
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    url: 'https://www.colegioacropolis.net',
    siteName: 'Colegio Acrópolis',
    title: 'Colegio Acrópolis — Puente Alto, Santiago',
    description:
      'Portal institucional del Colegio Acrópolis. Noticias, eventos y recursos para nuestra comunidad escolar.',
    images: [
      {
        url: '/images/frontis-colegio.webp',
        width: 1200,
        height: 630,
        alt: 'Frontis del Colegio Acrópolis',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Colegio Acrópolis — Puente Alto, Santiago',
    description:
      'Portal institucional del Colegio Acrópolis. Noticias, eventos y recursos para nuestra comunidad escolar.',
    images: ['/images/frontis-colegio.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Consultar configuración del sitio para inyectar al SEO Schema y contexto global
  let configInfo = null;
  try {
    const res = await db.select().from(configuracionSitio).limit(1);
    if (res.length > 0) {
      configInfo = res[0];
    }
  } catch (error) {
    console.error("Error cargando metadatos para SEO:", error);
  }

  // Extraer teléfonos y emails con valores por defecto si no existen
  const mainPhone = configInfo?.telefonos && Array.isArray(configInfo.telefonos) && configInfo.telefonos.length > 0 
    ? (configInfo.telefonos[0] as any).numero 
    : '+56 2 2269 1234'; // Valor default de contingencia

  const mainEmail = configInfo?.emails && Array.isArray(configInfo.emails) && configInfo.emails.length > 0 
    ? (configInfo.emails[0] as any).email 
    : 'contacto@colegioacropolis.cl';

  // Schema.org School para SEO Dinámico
  const schoolSchema = {
    '@context': 'https://schema.org',
    '@type': 'School',
    name: 'Colegio Acrópolis',
    url: 'https://www.colegioacropolis.net',
    logo: 'https://www.colegioacropolis.net/images/logo-acropolis.webp',
    image: 'https://www.colegioacropolis.net/images/frontis-colegio.webp',
    telephone: mainPhone,
    email: mainEmail,
    address: {
      '@type': 'PostalAddress',
      streetAddress: configInfo?.direccion || 'Miguel Ángel 0285',
      addressLocality: 'Puente Alto',
      addressRegion: 'Región Metropolitana',
      addressCountry: 'CL',
    },
    sameAs: configInfo?.redesSociales 
      ? (configInfo.redesSociales as any[]).map(rs => rs.url).filter(Boolean)
      : []
  };

  return (
    <html lang="es" className={plusJakarta.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schoolSchema) }}
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
