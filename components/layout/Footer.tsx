import Image from 'next/image';
import Link from 'next/link';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { NavLink, SocialIcon } from './Header';

type ContactInfo = {
  redesSociales: { plataforma: string; url: string; mostrarEn: string; orden: number }[];
  telefonos: { etiqueta: string; numero: string; tipo: string }[];
  emails: { etiqueta: string; email: string }[];
  direccion: string;
  mapaEmbedUrl: string;
};

// Fallback data when no config exists yet
const FALLBACK_REDES = [
  { plataforma: 'facebook', url: 'https://facebook.com/colegioacropolispuentealto', mostrarEn: 'ambos', orden: 1 },
  { plataforma: 'instagram', url: 'https://instagram.com/colegioacropolis', mostrarEn: 'ambos', orden: 2 },
];
const FALLBACK_TELEFONOS = [{ etiqueta: 'Principal', numero: '+56 2 2269 1234', tipo: 'fijo' }];
const FALLBACK_EMAILS = [{ etiqueta: 'Contacto', email: 'contacto@colegioacropolis.net' }];
const FALLBACK_DIRECCION = 'Ángel Pimentel 01003, Puente Alto, Santiago, Chile';
const FALLBACK_MAPA = 'https://www.google.com/maps?q=-33.5892190,-70.5671978&output=embed&z=16';

const cleanUrl = (url: string) => {
  let cleaned = url.trim().replace(/\s/g, '');
  if (cleaned && !cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = `https://${cleaned}`;
  }
  return cleaned;
};

function getPhoneIcon(tipo: string) {
  switch (tipo) {
    case 'whatsapp': return <MessageCircle size={16} className="shrink-0 text-cian" />;
    default: return <Phone size={16} className="shrink-0 text-cian" />;
  }
}

export default function Footer({ quickLinks = [], contactInfo }: { quickLinks?: NavLink[]; contactInfo?: ContactInfo }) {
  const redes = contactInfo?.redesSociales?.length ? contactInfo.redesSociales : FALLBACK_REDES;
  const telefonos = contactInfo?.telefonos?.length ? contactInfo.telefonos : FALLBACK_TELEFONOS;
  const emails = contactInfo?.emails?.length ? contactInfo.emails : FALLBACK_EMAILS;
  const direccion = contactInfo?.direccion || FALLBACK_DIRECCION;
  const mapaUrl = contactInfo?.mapaEmbedUrl || FALLBACK_MAPA;

  const footerRedes = redes
    .filter((r) => r.mostrarEn === 'footer' || r.mostrarEn === 'ambos')
    .sort((a, b) => (a.orden || 0) - (b.orden || 0));

  // Extract mapa src from iframe if needed
  let finalMapSrc = mapaUrl;
  if (finalMapSrc.includes('<iframe') && finalMapSrc.includes('src="')) {
    const match = finalMapSrc.match(/src="([^"]+)"/);
    if (match?.[1]) finalMapSrc = match[1];
  }

  return (
    <footer id="footer" className="relative bg-[#16213e] text-gris-claro overflow-hidden">
      {/* 1. Línea de Acento Holográfica / Top Divider */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-azul-acropolis via-cian to-amarillo opacity-90 shadow-[0_0_15px_rgba(19,197,181,0.5)]" />
      
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-16 relative z-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          {/* Columna 1: Logo y contacto */}
          <div className="lg:col-span-4">
            <div className="mb-8 flex items-center gap-4">
              <Image
                src="/images/logo-acropolis.webp"
                alt="Logo Colegio Acrópolis"
                width={80}
                height={80}
                className="rounded-full"
              />
              <div>
                <h3 className="text-xl font-bold tracking-tight text-white">Colegio Acrópolis</h3>
                <p className="text-sm text-cian">Puente Alto, Santiago</p>
              </div>
            </div>
            <div className="mb-6 space-y-3 text-sm">
              {/* Dirección */}
              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0 text-cian" />
                <span className="leading-snug">{direccion}</span>
              </div>
              {/* Teléfonos (múltiples) */}
              {telefonos.map((tel, i) => (
                <div key={i} className="flex items-center gap-3">
                  {getPhoneIcon(tel.tipo)}
                  <span>
                    {tel.numero}
                    {tel.etiqueta && <span className="ml-2 text-xs text-gris-texto">({tel.etiqueta})</span>}
                  </span>
                </div>
              ))}
              {/* Emails (múltiples) */}
              {emails.map((em, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Mail size={16} className="shrink-0 text-cian" />
                  <span>
                    {em.email}
                    {em.etiqueta && <span className="ml-2 text-xs text-gris-texto">({em.etiqueta})</span>}
                  </span>
                </div>
              ))}
            </div>
            {/* Redes sociales dinámicas */}
            <div className="mt-8 flex items-center gap-3 text-white">
              {footerRedes.map((red, i) => (
                <a
                  key={`${red.plataforma}-${i}`}
                  href={cleanUrl(red.url)}
                  target="_blank"
                  rel={red.plataforma === 'instagram' ? 'noopener' : 'noopener noreferrer'}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1 hover:bg-cian/20 hover:text-cian hover:ring-cian/50 hover:shadow-[0_4px_20px_rgba(19,197,181,0.3)]"
                  aria-label={red.plataforma}
                >
                  <SocialIcon platform={red.plataforma} size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Columna 2: Links rápidos */}
          <div className="lg:col-span-3 lg:pl-10">
            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-white/90">
              Enlaces rápidos
            </h4>
            <nav className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gris-texto transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Columna 3: Mapa de Google Maps */}
          <div className="md:col-span-2 lg:col-span-5">
            <h4 className="mb-6 flex items-center justify-between text-sm font-bold uppercase tracking-widest text-white/90">
              Ubicación
              <span className="inline-flex items-center rounded-full bg-azul-acropolis/20 px-3 py-0.5 text-[10px] sm:text-xs font-semibold tracking-wider text-cian ring-1 ring-inset ring-cian/30">
                Sede Central
              </span>
            </h4>
            <div className="group relative overflow-hidden rounded-3xl ring-1 ring-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.15)] transition-all duration-500 hover:shadow-[0_8px_40px_rgba(19,197,181,0.2)] hover:ring-cian/40 bg-[#1e293b]">
              {/* Capa de tinte oscuro para integrar con el fondo. Desaparece en hover */}
              <div className="pointer-events-none absolute inset-0 z-10 bg-[#16213e]/40 transition-opacity duration-700 group-hover:opacity-0" />
              
              <iframe
                src={finalMapSrc}
                width="100%"
                height="280"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Colegio Acrópolis en Google Maps"
                className="h-[280px] w-full rounded-3xl opacity-80 filter transition-all duration-700 grayscale-[40%] contrast-125 group-hover:opacity-100 group-hover:grayscale-0 group-hover:contrast-100"
              />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-gris-texto">
          <p>
            © {new Date().getFullYear()} Colegio Acrópolis. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
