'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Lock, Phone, Mail } from 'lucide-react';

export type NavLink = { href: string; label: string };

type ContactInfo = {
  redesSociales: { plataforma: string; url: string; mostrarEn: string; orden: number }[];
  telefonos: { etiqueta: string; numero: string; tipo: string }[];
  emails: { etiqueta: string; email: string }[];
  direccion: string;
  mapaEmbedUrl: string;
};

// Social media SVG icons by platform
const cleanUrl = (url: string) => {
  let cleaned = url.trim().replace(/\s/g, '');
  // Force https if protocol is missing
  if (cleaned && !cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = `https://${cleaned}`;
  }
  return cleaned;
};

function SocialIcon({ platform, size = 22 }: { platform: string; size?: number }) {
  switch (platform) {
    case 'facebook':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
        </svg>
      );
    case 'instagram':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
        </svg>
      );
    case 'tiktok':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
        </svg>
      );
    case 'whatsapp':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        </svg>
      );
    case 'youtube':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
          <path d="m10 15 5-3-5-3z"/>
        </svg>
      );
    case 'twitter':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
        </svg>
      );
    case 'linkedin':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
          <rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
        </svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      );
  }
}

// Fallback data when no config exists yet
const FALLBACK_REDES = [
  { plataforma: 'facebook', url: 'https://facebook.com/colegioacropolispuentealto', mostrarEn: 'ambos', orden: 1 },
  { plataforma: 'instagram', url: 'https://instagram.com/colegio_acropolis_oficial', mostrarEn: 'ambos', orden: 2 },
];
const FALLBACK_TELEFONOS = [{ etiqueta: 'Principal', numero: '+56 2 2269 1234', tipo: 'fijo' }];
const FALLBACK_EMAILS = [{ etiqueta: 'Contacto', email: 'contacto@colegioacropolis.net' }];

export default function Header({ navLinks = [], contactInfo }: { navLinks?: NavLink[]; contactInfo?: ContactInfo }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const redes = contactInfo?.redesSociales?.length ? contactInfo.redesSociales : FALLBACK_REDES;
  const telefonos = contactInfo?.telefonos?.length ? contactInfo.telefonos : FALLBACK_TELEFONOS;
  const emails = contactInfo?.emails?.length ? contactInfo.emails : FALLBACK_EMAILS;

  const headerRedes = redes
    .filter((r) => r.mostrarEn === 'header' || r.mostrarEn === 'ambos')
    .sort((a, b) => (a.orden || 0) - (b.orden || 0));

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Barra superior azul — más generosa (aumentada 30%) */}
      <div className="bg-azul-acropolis text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-sm font-medium tracking-wide sm:py-5">
          <div className="flex items-center gap-6">
            {/* Primer teléfono */}
            {telefonos[0] && (
              <span className="flex items-center gap-2">
                <Phone size={14} className="text-amarillo" />
                <span className="text-xs sm:text-sm">{telefonos[0].numero}</span>
              </span>
            )}
            {/* Primer email */}
            {emails[0] && (
              <span className="hidden items-center gap-2 md:flex">
                <Mail size={14} className="text-amarillo" />
                {emails[0].email}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {headerRedes.map((red, i) => (
              <a
                key={`${red.plataforma}-${i}`}
                href={cleanUrl(red.url)}
                target="_blank"
                rel={red.plataforma === 'instagram' ? 'noopener' : 'noopener noreferrer'}
                aria-label={red.plataforma}
                className="text-white/80 transition-colors hover:text-amarillo"
              >
                <SocialIcon platform={red.plataforma} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Navbar — amplia, con logo grande y texto limpio */}
      <nav className="bg-white shadow-[var(--shadow-navbar)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-4">
            <Image
              src="/images/logo-acropolis.webp"
              alt="Logo Colegio Acrópolis"
              width={76}
              height={76}
              className="rounded-full"
              priority
            />
            <span className="hidden text-sm font-medium tracking-[0.15em] text-negro antialiased lg:inline">
              COLEGIO ACRÓPOLIS
            </span>
          </Link>

          {/* Links Desktop */}
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200 hover:bg-azul-soft hover:text-azul-acropolis ${
                  isActive ? 'bg-azul-soft text-azul-acropolis' : 'text-gris-texto'
                }`}
              >
                {link.label}
              </Link>
            )})}
          </div>

          {/* Admin + Mobile Toggle */}
          <div className="flex items-center gap-2">
            <Link
              href="/admin/login"
              className="rounded-xl p-2.5 text-gris-texto transition-colors hover:bg-gris-claro hover:text-negro"
              aria-label="Acceso administrador"
            >
              <Lock size={18} />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl p-2.5 text-negro lg:hidden"
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-gris-claro px-6 pb-4 pt-2 lg:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-azul-soft hover:text-azul-acropolis ${
                    isActive ? 'bg-azul-soft text-azul-acropolis' : 'text-negro'
                  }`}
                >
                  {link.label}
                </Link>
              )})}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

// Export SocialIcon for use by Footer
export { SocialIcon };
