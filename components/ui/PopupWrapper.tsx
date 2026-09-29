'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, ExternalLink, ArrowRight } from 'lucide-react';
import { AmbientEffectLayer } from './AmbientEffects';

interface Popup {
  id: number;
  titulo: string;
  contenido: string;
  imagenUrl: string | null;
  enlaceUrl: string | null;
  enlaceTexto: string | null;
  posicion: string;
  estiloImagen: string;
  colorFondo: string;
  colorTexto: string;
  colorBoton: string;
  colorTextoBoton: string;
  paginaDestino: string;
  tamanoTitulo: string;
  tipo: string;
  frecuencia: string;
  prioridad: number;
  efectoVisual: string;
}

interface RawPopup {
  id: number;
  titulo: string;
  contenido: string;
  imagenUrl?: string | null;
  botonTexto?: string | null;
  botonUrl?: string | null;
  posicion?: string | null;
  estiloImagen?: string | null;
  colorFondo?: string | null;
  colorTexto?: string | null;
  colorBoton?: string | null;
  colorTextoBoton?: string | null;
  paginaDestino?: string | null;
  tamanoTitulo?: string | null;
  tipo?: string | null;
  frecuencia?: string | null;
  prioridad?: number | null;
  efectoVisual?: string | null;
}

// Convierte enlaces absolutos del propio colegio a rutas relativas para mantener la navegación local y SPA
function normalizeInternalUrl(url: string | null): { href: string; isExternal: boolean } {
  if (!url) return { href: '#', isExternal: false };
  const trimmed = url.trim();

  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return { href: trimmed, isExternal: false };
  }

  try {
    const parsed = new URL(trimmed);
    const internalHostnames = [
      'colegioacropolis.net',
      'www.colegioacropolis.net',
      'colegioacropolis.cl',
      'www.colegioacropolis.cl',
      'localhost',
      '127.0.0.1',
    ];

    if (internalHostnames.includes(parsed.hostname.toLowerCase())) {
      const relativePath = `${parsed.pathname}${parsed.search}${parsed.hash}` || '/';
      return { href: relativePath, isExternal: false };
    }

    return { href: trimmed, isExternal: true };
  } catch {
    return { href: trimmed, isExternal: false };
  }
}

// Helpers seguros para almacenamiento en navegador (evitan errores en SSR)
function isPopupDismissed(id: number, frecuencia: string, today: string): boolean {
  if (typeof window === 'undefined') return false;

  // 1. Frecuencia 'siempre': Descarte válido durante toda la sesión actual (sessionStorage)
  if (frecuencia === 'siempre') {
    try {
      return sessionStorage.getItem(`popup_session_dismissed_${id}`) === 'true';
    } catch {
      return false;
    }
  }

  // 2. Frecuencia 'una_vez_por_dia': Descarte válido durante el día calendario (localStorage)
  if (frecuencia === 'una_vez_por_dia') {
    try {
      return localStorage.getItem(`popup_read_${id}`) === today;
    } catch {
      return false;
    }
  }

  // 3. Frecuencia 'una_vez': Descarte permanente en el dispositivo (localStorage)
  try {
    return Boolean(localStorage.getItem(`popup_read_${id}`));
  } catch {
    return false;
  }
}

function markPopupDismissed(id: number, frecuencia: string, today: string) {
  if (typeof window === 'undefined') return;

  if (frecuencia === 'siempre') {
    try {
      sessionStorage.setItem(`popup_session_dismissed_${id}`, 'true');
    } catch {
      // Ignorar restricciones en navegación privada
    }
  } else if (frecuencia === 'una_vez_por_dia') {
    try {
      localStorage.setItem(`popup_read_${id}`, today);
    } catch {
      // Ignorar restricciones en navegación privada
    }
  } else {
    try {
      localStorage.setItem(`popup_read_${id}`, 'true');
    } catch {
      // Ignorar restricciones en navegación privada
    }
  }
}

// =========================================================================
// COMPONENTE INDIVIDUAL DE POPUP (Gestiona su propia animación y cierre)
// =========================================================================
interface PopupItemProps {
  popup: Popup;
  onDismiss: (id: number, frecuencia: string) => void;
}

function PopupItem({ popup, onDismiss }: PopupItemProps) {
  const [visible, setVisible] = useState(false);
  const exitTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    exitTimerRef.current = setTimeout(() => {
      onDismiss(popup.id, popup.frecuencia);
    }, 350);
  };

  const handleCtaClick = () => {
    handleDismiss();
  };

  const isUrgent = popup.tipo === 'urgente';
  const ctaLabel = popup.enlaceTexto?.trim() || 'Ver más información';

  const titleSizes: Record<string, string> = {
    sm: 'text-base sm:text-lg',
    md: 'text-lg sm:text-xl',
    lg: 'text-xl sm:text-2xl',
    xl: 'text-2xl sm:text-3xl',
  };
  const titleClass = titleSizes[popup.tamanoTitulo] || titleSizes.md;

  const badgeColors: Record<string, string> = {
    info: 'bg-azul-acropolis text-white',
    urgente: 'bg-red-500 text-white',
    matricula: 'bg-emerald-600 text-white',
    evento: 'bg-amber-500 text-white',
  };
  const badgeLabels: Record<string, string> = {
    info: 'Información',
    urgente: 'Urgente',
    matricula: 'Matrícula',
    evento: 'Evento',
  };

  const isBanner = popup.posicion.includes('banner');

  // RENDER: BANNER (superior o inferior)
  if (isBanner) {
    const isTop = popup.posicion === 'banner-superior';
    const posClass = isTop
      ? 'fixed top-0 left-0 right-0 z-50'
      : 'fixed bottom-0 left-0 right-0 z-50';

    const slideFrom = isTop ? 'translateY(-100%)' : 'translateY(100%)';

    return (
      <div className={posClass}>
        <div
          className="w-full shadow-xl transition-all duration-500 ease-out border-b border-black/10"
          style={{
            backgroundColor: popup.colorFondo,
            color: popup.colorTexto,
            transform: visible ? 'translateY(0)' : slideFrom,
            opacity: visible ? 1 : 0,
          }}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <div className="flex flex-1 items-center gap-3">
              {isUrgent ? (
                <span className="relative flex h-3 w-3 flex-shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
                </span>
              ) : (
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${badgeColors[popup.tipo] || badgeColors.info}`}>
                  {badgeLabels[popup.tipo] || 'Aviso'}
                </span>
              )}
              <div className="text-sm font-medium leading-normal">
                <strong className="font-bold">{popup.titulo}</strong>: <span className="[&_p]:inline [&_strong]:font-bold [&_em]:italic" dangerouslySetInnerHTML={{ __html: popup.contenido }} />
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {popup.enlaceUrl && (() => {
                const { href, isExternal } = normalizeInternalUrl(popup.enlaceUrl);
                return (
                  <Link
                    href={href}
                    onClick={handleCtaClick}
                    target={isExternal ? '_blank' : '_self'}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-bold transition-all hover:scale-105 shadow-sm"
                    style={{
                      backgroundColor: popup.colorBoton,
                      color: popup.colorTextoBoton,
                    }}
                  >
                    {ctaLabel}
                    {isExternal ? <ExternalLink size={14} /> : <ArrowRight size={14} />}
                  </Link>
                );
              })()}
              <button
                onClick={handleDismiss}
                className="rounded-full p-1.5 transition-colors hover:bg-black/10"
                style={{ color: popup.colorTexto }}
                aria-label="Cerrar aviso"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // RENDER: MODAL / ESQUINA
  const isModal = popup.posicion === 'centro-modal';

  let containerClass = 'fixed z-50 ';
  if (isModal) {
    containerClass += 'inset-0 flex items-center justify-center p-4 sm:p-6';
  } else if (popup.posicion === 'inferior-derecha') {
    containerClass += 'bottom-4 right-4 sm:bottom-6 sm:right-6';
  } else if (popup.posicion === 'inferior-izquierda') {
    containerClass += 'bottom-4 left-4 sm:bottom-6 sm:left-6';
  }

  const cardWidth = isModal
    ? 'w-full max-w-[480px] sm:max-w-[540px] lg:max-w-[580px]'
    : 'w-[320px] sm:w-[360px]';

  const isEffectiveSoloImagen = popup.estiloImagen === 'solo-imagen' && Boolean(popup.imagenUrl);
  const hasHalo = popup.efectoVisual === 'halo_radiante';

  return (
    <>
      {/* Backdrop oscuro sólo para modales centrales con soporte de Efecto Ambiental */}
      {isModal && (
        <div
          className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-hidden ${
            visible ? 'popup-backdrop-enter' : 'popup-backdrop-exit'
          }`}
          onClick={handleDismiss}
        >
          {visible && <AmbientEffectLayer efectoVisual={popup.efectoVisual} />}
        </div>
      )}

      {/* Tarjeta de Popup */}
      <div className={containerClass} style={{ zIndex: isModal ? 52 : 45 }}>
        <div
          className={`
            ${cardWidth}
            ${visible ? 'popup-card-enter' : 'popup-card-exit'}
            ${isUrgent ? 'popup-glow-urgent' : ''}
            ${hasHalo ? 'popup-halo-radiante' : ''}
            relative overflow-y-auto max-h-[90vh] overflow-x-hidden rounded-2xl shadow-2xl border border-black/5
          `}
          style={{
            backgroundColor: popup.estiloImagen !== 'fondo' ? popup.colorFondo : undefined,
            color: popup.colorTexto,
          }}
        >
          {/* Estilo: Como Fondo */}
          {popup.estiloImagen === 'fondo' && popup.imagenUrl && (
            <div className="absolute inset-0 z-0">
              <img
                src={popup.imagenUrl}
                alt=""
                className="h-full w-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ backgroundColor: popup.colorFondo, opacity: 0.85 }}
              />
            </div>
          )}

          {/* Estilo: Solo Imagen */}
          {isEffectiveSoloImagen && popup.imagenUrl && (
            <div className="relative flex flex-col w-full">
              <button
                onClick={handleDismiss}
                className="absolute right-3 top-3 z-30 rounded-full bg-black/50 p-2 text-white backdrop-blur-md transition-all hover:bg-black/75 hover:scale-110 shadow-lg"
                aria-label="Cerrar aviso"
              >
                <X size={18} />
              </button>

              {popup.enlaceUrl && !popup.enlaceTexto ? (() => {
                const { href, isExternal } = normalizeInternalUrl(popup.enlaceUrl);
                return (
                  <Link
                    href={href}
                    onClick={handleCtaClick}
                    target={isExternal ? '_blank' : '_self'}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    className="block w-full cursor-pointer"
                  >
                    <img
                      src={popup.imagenUrl}
                      alt={popup.titulo}
                      className="w-full h-auto object-contain max-h-[82vh]"
                    />
                  </Link>
                );
              })() : (
                <img
                  src={popup.imagenUrl}
                  alt={popup.titulo}
                  className="w-full h-auto object-contain max-h-[82vh]"
                />
              )}

              {popup.enlaceUrl && popup.enlaceTexto && (() => {
                const { href, isExternal } = normalizeInternalUrl(popup.enlaceUrl);
                return (
                  <div className="p-4" style={{ backgroundColor: popup.colorFondo }}>
                    <Link
                      href={href}
                      onClick={handleCtaClick}
                      target={isExternal ? '_blank' : '_self'}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      className="flex items-center justify-center gap-2 w-full rounded-xl py-3.5 text-center text-sm font-bold tracking-wide transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-md"
                      style={{
                        backgroundColor: popup.colorBoton,
                        color: popup.colorTextoBoton,
                      }}
                    >
                      <span>{ctaLabel}</span>
                      {isExternal ? <ExternalLink size={16} /> : <ArrowRight size={16} />}
                    </Link>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Contenido Principal Estándar */}
          {!isEffectiveSoloImagen && (
            <div className="relative z-10 flex flex-col">
              <button
                onClick={handleDismiss}
                className="absolute right-3.5 top-3.5 z-20 rounded-full bg-black/20 p-2 text-white backdrop-blur-md transition-all hover:bg-black/40 hover:scale-110 shadow-sm"
                aria-label="Cerrar aviso"
              >
                <X size={18} />
              </button>

              {isUrgent && (
                <div className="absolute left-4 top-4 z-20 flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-md">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                  </span>
                  Urgente
                </div>
              )}

              {popup.estiloImagen === 'encabezado' && popup.imagenUrl && (
                <div className="relative w-full overflow-hidden bg-black/5 flex items-center justify-center">
                  <img
                    src={popup.imagenUrl}
                    alt={popup.titulo}
                    className="w-full max-h-[360px] object-contain sm:object-cover"
                  />
                </div>
              )}

              <div className="flex flex-col gap-3.5 p-6 sm:p-7">
                {!isUrgent && (
                  <span
                    className={`${badgeColors[popup.tipo] || badgeColors.info} w-fit rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider`}
                  >
                    {badgeLabels[popup.tipo] || 'Aviso'}
                  </span>
                )}

                <h3 className={`${titleClass} font-bold leading-tight`}>
                  {popup.titulo}
                </h3>

                <div
                  className="text-sm sm:text-base leading-relaxed opacity-90 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_strong]:font-bold [&_em]:italic [&_ul]:list-disc [&_ul]:ml-5 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:ml-5 [&_ol]:mb-3 [&_a]:underline [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:p-2"
                  dangerouslySetInnerHTML={{ __html: popup.contenido }}
                />

                {popup.enlaceUrl && (() => {
                  const { href, isExternal } = normalizeInternalUrl(popup.enlaceUrl);
                  return (
                    <Link
                      href={href}
                      onClick={handleCtaClick}
                      target={isExternal ? '_blank' : '_self'}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      className="mt-3 flex items-center justify-center gap-2 w-full rounded-xl py-3.5 text-center text-sm font-bold tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md"
                      style={{
                        backgroundColor: popup.colorBoton,
                        color: popup.colorTextoBoton,
                      }}
                    >
                      <span>{ctaLabel}</span>
                      {isExternal ? <ExternalLink size={16} /> : <ArrowRight size={16} />}
                    </Link>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// =========================================================================
// CONTENEDOR PRINCIPAL: GESTOR MULTI-POPUP CON ASIGNACIÓN DE SLOTS
// =========================================================================
export default function PopupWrapper() {
  const pathname = usePathname();
  const [allPopups, setAllPopups] = useState<Popup[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<number>>(new Set());

  // Carga inicial de popups desde la API con Scale-to-Zero caching
  useEffect(() => {
    async function fetchPopups() {
      try {
        const res = await fetch('/api/popups', { next: { revalidate: 86400 } });
        if (res.ok) {
          const data = await res.json();
          const list: RawPopup[] = Array.isArray(data?.popups)
            ? data.popups
            : data?.popup
              ? [data.popup]
              : [];

          const formatted: Popup[] = list.map((p) => ({
            id: p.id,
            titulo: p.titulo,
            contenido: p.contenido,
            imagenUrl: p.imagenUrl || null,
            enlaceUrl: p.botonUrl || null,
            enlaceTexto: p.botonTexto || null,
            posicion: p.posicion || 'centro-modal',
            estiloImagen: p.estiloImagen || 'encabezado',
            colorFondo: p.colorFondo || '#ffffff',
            colorTexto: p.colorTexto || '#111827',
            colorBoton: p.colorBoton || '#4661F6',
            colorTextoBoton: p.colorTextoBoton || '#ffffff',
            paginaDestino: p.paginaDestino || 'todas',
            tamanoTitulo: p.tamanoTitulo || 'md',
            tipo: p.tipo || 'info',
            frecuencia: p.frecuencia || 'una_vez',
            prioridad: typeof p.prioridad === 'number' ? p.prioridad : 5,
            efectoVisual: p.efectoVisual || 'ninguno',
          }));

          setAllPopups(formatted);
        }
      } catch (error) {
        console.error('[PopupWrapper] Error al consultar popups:', error);
      }
    }

    fetchPopups();
  }, []);

  // Determinar reactivamente qué popups no conflictivos mostrar según ruta y sesión
  const activePopups = useMemo(() => {
    if (!allPopups.length) return [];

    const currentPath = pathname || '/';
    const today = new Date().toISOString().split('T')[0];

    // 1. Filtrar popups que correspondan a la página actual y no hayan sido descartados
    const matching = allPopups.filter((p) => {
      // Descartado en memoria de la sesión activa
      if (dismissedIds.has(p.id)) return false;

      // Aislamiento estricto por ruta de destino
      if (p.paginaDestino !== 'todas') {
        const cleanDestino = p.paginaDestino.replace(/\/+$/, '') || '/';
        const cleanCurrent = currentPath.replace(/\/+$/, '') || '/';
        if (cleanDestino !== cleanCurrent) return false;
      }

      // Verificación en sessionStorage (para 'siempre') o localStorage (para 'una_vez' / 'una_vez_por_dia')
      if (isPopupDismissed(p.id, p.frecuencia, today)) return false;

      return true;
    });

    // 2. Ordenar por prioridad descendente (específico sobre 'todas' a igual prioridad)
    matching.sort((a, b) => {
      if (b.prioridad !== a.prioridad) {
        return b.prioridad - a.prioridad;
      }
      if (a.paginaDestino !== 'todas' && b.paginaDestino === 'todas') return -1;
      if (b.paginaDestino !== 'todas' && a.paginaDestino === 'todas') return 1;
      return 0;
    });

    // 3. Asignación de Slots No Conflictivos:
    // Slot A: Máximo 1 Banner (superior o inferior)
    const selectedBanner = matching.find((p) => p.posicion.startsWith('banner'));

    // Slot B: Máximo 1 Elemento Flotante (modal central o esquina inferior)
    // El modal central tiene precedencia sobre la esquina para evitar solapamiento de fondo oscuro
    const selectedModal = matching.find((p) => p.posicion === 'centro-modal');
    const selectedCorner = matching.find((p) => p.posicion.startsWith('inferior-'));
    const selectedFloating = selectedModal || selectedCorner;

    const result: Popup[] = [];
    if (selectedBanner) result.push(selectedBanner);
    if (selectedFloating && selectedFloating.id !== selectedBanner?.id) {
      result.push(selectedFloating);
    }

    return result;
  }, [allPopups, pathname, dismissedIds]);

  const handleDismiss = (id: number, frecuencia: string) => {
    const today = new Date().toISOString().split('T')[0];
    markPopupDismissed(id, frecuencia, today);
    setDismissedIds((prev) => new Set(prev).add(id));
  };

  if (activePopups.length === 0) return null;

  return (
    <>
      <style jsx global>{`
        @keyframes popupSlideUp {
          0% { opacity: 0; transform: translateY(30px) scale(0.95); }
          60% { opacity: 1; transform: translateY(-4px) scale(1.005); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes popupFadeOut {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(20px) scale(0.95); }
        }
        @keyframes backdropFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes backdropFadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 10px rgba(239, 68, 68, 0.3), 0 0 24px rgba(239, 68, 68, 0.15); }
          50% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.6), 0 0 45px rgba(239, 68, 68, 0.25); }
        }
        @keyframes haloPulse {
          0%, 100% {
            box-shadow: 0 0 25px 4px rgba(70, 97, 246, 0.65), 0 0 55px 14px rgba(147, 51, 234, 0.45);
          }
          50% {
            box-shadow: 0 0 45px 10px rgba(70, 97, 246, 0.9), 0 0 85px 24px rgba(147, 51, 234, 0.65);
          }
        }
        .popup-card-enter {
          animation: popupSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .popup-card-exit {
          animation: popupFadeOut 0.3s ease-in forwards;
        }
        .popup-backdrop-enter {
          animation: backdropFadeIn 0.3s ease-out forwards;
        }
        .popup-backdrop-exit {
          animation: backdropFadeOut 0.25s ease-in forwards;
        }
        .popup-glow-urgent {
          animation: glowPulse 2s ease-in-out infinite;
        }
        .popup-halo-radiante {
          box-shadow: 0 0 25px 4px rgba(70, 97, 246, 0.65), 0 0 55px 14px rgba(147, 51, 234, 0.45);
          animation: popupSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, haloPulse 2.5s ease-in-out infinite alternate !important;
        }
      `}</style>

      {activePopups.map((popup) => (
        <PopupItem key={popup.id} popup={popup} onDismiss={handleDismiss} />
      ))}
    </>
  );
}
