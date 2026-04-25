'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Newspaper,
  Users,
  CalendarDays,
  FileDown,
  Bell,
  Image as ImageIcon,
  Mail,
  Heart,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Globe,
  Menu,
  X,
  Files,
  Settings2,
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';

const sidebarLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/paginas', label: 'PáginasWeb', icon: Files },
  { href: '/admin/journal', label: 'Journal', icon: Newspaper },
  { href: '/admin/coordinaciones', label: 'Coordinaciones', icon: Users },
  { href: '/admin/eventos', label: 'Eventos', icon: CalendarDays },
  { href: '/admin/calendarios', label: 'Calendarios', icon: CalendarDays },
  { href: '/admin/descargas', label: 'Descargas', icon: FileDown },
  { href: '/admin/popups', label: 'Popups', icon: Bell },
  { href: '/admin/galeria', label: 'Galería', icon: ImageIcon },
  { href: '/admin/mensajes', label: 'Mensajes', icon: Mail },
  { href: '/admin/centro-de-padres', label: 'Centro de Padres', icon: Heart },
  { href: '/admin/matricula', label: 'Matrícula', icon: GraduationCap },
  { href: '/admin/configuracion', label: 'Configuración', icon: Settings2 },
];

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // No mostrar sidebar en la página de login
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  return (
    <div className="flex min-h-screen bg-gris-claro">
      <Toaster position="top-right" />
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-negro transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
          <Image
            src="/images/logo-acropolis.webp"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <p className="text-sm font-bold text-white">Colegio Acrópolis</p>
            <p className="text-xs text-gris-texto">Panel Admin</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto text-gris-texto lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-azul-acropolis text-white shadow-md'
                      : 'text-gris-texto hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-white/10 px-3 py-4 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-gris-texto transition-colors hover:bg-azul-acropolis/10 hover:text-azul-acropolis"
          >
            <Globe size={18} />
            Ver Sitio Web
          </a>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-gris-texto transition-colors hover:bg-fucsia/10 hover:text-fucsia"
          >
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top bar mobile */}
        <div className="sticky top-0 z-30 flex items-center gap-4 border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-xl p-2 text-negro hover:bg-gris-claro"
          >
            <Menu size={20} />
          </button>
          <span className="text-sm font-semibold text-negro">Panel Administrativo</span>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
