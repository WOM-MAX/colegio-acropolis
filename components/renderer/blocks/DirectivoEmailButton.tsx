'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mail, Check, Copy, ExternalLink, ChevronDown } from 'lucide-react';

interface DirectivoEmailButtonProps {
  email: string;
  nombre: string;
}

export default function DirectivoEmailButton({ email, nombre }: DirectivoEmailButtonProps) {
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Acción inteligente (En celulares abre la app nativa; en PC copia con feedback)
  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const isMobile = typeof window !== 'undefined' && (
      /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      window.matchMedia('(pointer: coarse)').matches
    );

    if (isMobile) {
      // En celular abre inmediatamente Gmail / Apple Mail nativo
      window.location.href = `mailto:${email}`;
    } else {
      // En computador copia al portapapeles con confirmación visual
      navigator.clipboard.writeText(email);
      setCopied(true);
      setMenuOpen(false);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Copia explícita desde el menú
  const handleExplicitCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setMenuOpen(false);
    setTimeout(() => setCopied(false), 2500);
  };

  // Cerrar menú al hacer clic afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
  const outlookUrl = `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(email)}`;

  return (
    <div className="relative w-full" ref={menuRef}>
      {/* Botón Principal Dividido (Acción de Copiar + Menú de Redacción Web) */}
      <div className="inline-flex w-full items-stretch rounded-xl border border-slate-200/90 bg-slate-50 shadow-2xs transition-all hover:border-azul-acropolis/40 hover:bg-azul-soft/30 hover:shadow-xs">
        
        {/* Botón de Acción Directa (Celular: abre app; PC: copia al portapapeles) */}
        <button
          type="button"
          onClick={handleAction}
          className="flex flex-1 items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:text-azul-acropolis"
          title={`Contactar o copiar correo de ${nombre}`}
        >
          {copied ? (
            <>
              <Check size={13} className="shrink-0 text-emerald-600 animate-scale-in" />
              <span className="font-bold text-emerald-700">¡Correo copiado!</span>
            </>
          ) : (
            <>
              <Mail size={13} className="shrink-0 text-azul-acropolis" />
              <span className="truncate max-w-[155px] sm:max-w-[165px]">{email}</span>
            </>
          )}
        </button>

        {/* Botón Desplegable para Elegir Webmail / Gmail / Outlook */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setMenuOpen((prev) => !prev);
          }}
          className="flex items-center justify-center border-l border-slate-200/80 px-2 text-slate-500 hover:bg-azul-acropolis/10 hover:text-azul-acropolis transition-colors rounded-r-xl"
          title="Opciones para redactar correo"
          aria-expanded={menuOpen}
        >
          <ChevronDown size={12} className={`transition-transform duration-200 ${menuOpen ? 'rotate-180 text-azul-acropolis' : ''}`} />
        </button>
      </div>

      {/* Menú Desplegable Flotante */}
      {menuOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 z-30 rounded-2xl bg-white p-1.5 shadow-xl ring-1 ring-black/10 border border-slate-100 animate-scale-in text-left">
          <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
            Redactar mensaje a:
          </div>

          {/* Opción 1: Abrir en Gmail Web */}
          <a
            href={gmailUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-azul-soft hover:text-azul-acropolis transition-colors"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-red-50 text-red-600">
              <Mail size={12} />
            </div>
            <span>Abrir en Gmail</span>
            <ExternalLink size={11} className="ml-auto text-slate-400" />
          </a>

          {/* Opción 2: Abrir en Outlook Web */}
          <a
            href={outlookUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-azul-soft hover:text-azul-acropolis transition-colors"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-50 text-blue-600">
              <Mail size={12} />
            </div>
            <span>Abrir en Outlook Web</span>
            <ExternalLink size={11} className="ml-auto text-slate-400" />
          </a>

          {/* Opción 3: Copiar Correo */}
          <button
            type="button"
            onClick={handleExplicitCopy}
            className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-100 text-slate-600">
              <Copy size={12} />
            </div>
            <span>Copiar dirección</span>
          </button>

          {/* Opción 4: Cliente por defecto (mailto) */}
          <a
            href={`mailto:${email}`}
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-[11px] text-slate-500 hover:text-slate-800 transition-colors border-t border-slate-100 mt-1"
          >
            <span>Usar app de correo instalada</span>
          </a>
        </div>
      )}
    </div>
  );
}
