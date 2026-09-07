'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Sparkles,
  BookOpen
} from 'lucide-react';

export type TabItem = {
  id?: string;
  etiqueta: string;
  subetiqueta?: string;
  iconoEmoji?: string;
  tituloPanel?: string;
  contenidoHtml?: string;
  imagenUrl?: string;
  posicionImagen?: 'derecha' | 'izquierda' | 'sin_imagen';
  botonTexto?: string;
  botonUrl?: string;
  puntosClave?: string[];
};

export type TabsContenidoConfig = {
  tituloSeccion?: string;
  subtituloSeccion?: string;
  estiloTabs?: 'acropolis_3d' | 'pills' | 'subrayado';
  estiloFondo?: 'gris' | 'blanco' | 'azul';
  tabs?: TabItem[];
};

export default function TabsContenidoBlock({ configuracion }: { configuracion: TabsContenidoConfig }) {
  const {
    tituloSeccion = '',
    subtituloSeccion = '',
    estiloTabs = 'acropolis_3d',
    estiloFondo = 'blanco',
    tabs = [],
  } = configuracion;

  const [activeTab, setActiveTab] = useState(0);

  if (!tabs || tabs.length === 0) return null;

  const currentTab = tabs[activeTab] || tabs[0];

  const bgClasses: Record<string, string> = {
    gris: 'bg-gris-claro border-y border-gray-200/80',
    blanco: 'bg-white border-y border-gray-100',
    azul: 'bg-azul-soft/50 border-y border-azul-acropolis/20',
  };
  const sectionBg = bgClasses[estiloFondo] || bgClasses.blanco;

  return (
    <section className={`py-14 sm:py-20 transition-colors ${sectionBg}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Cabecera de la sección */}
        {(tituloSeccion || subtituloSeccion) && (
          <div className="mb-10 sm:mb-14 text-center max-w-3xl mx-auto">
            {tituloSeccion && (
              <div
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-negro tracking-tight mb-3 font-outfit [&>p]:m-0"
                dangerouslySetInnerHTML={{ __html: tituloSeccion }}
              />
            )}
            {subtituloSeccion && (
              <div
                className="text-base sm:text-lg text-gris-texto leading-relaxed [&>p]:m-0"
                dangerouslySetInnerHTML={{ __html: subtituloSeccion }}
              />
            )}
            <div className="mt-4 flex justify-center">
              <div className="h-1.5 w-16 rounded-full bg-linear-to-r from-azul-acropolis via-amarillo-acropolis to-fucsia" />
            </div>
          </div>
        )}

        {/* Barra de Navegación de Tabs */}
        <div className="flex justify-center mb-10 overflow-x-auto pb-2 scrollbar-none">
          {/* Estilo 1: Acrópolis 3D Container (inspirado en el Master Container de Calendarios) */}
          {estiloTabs === 'acropolis_3d' && (
            <div className="inline-flex p-1.5 rounded-2xl bg-gray-100/90 border border-gray-200 shadow-inner max-w-full">
              {tabs.map((tab, idx) => {
                const isActive = activeTab === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveTab(idx)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-white text-azul-acropolis shadow-md scale-102 font-extrabold'
                        : 'text-gris-texto hover:text-negro hover:bg-white/60'
                    }`}
                  >
                    {tab.iconoEmoji && <span className="text-base">{tab.iconoEmoji}</span>}
                    <div className="text-left">
                      <div>{tab.etiqueta}</div>
                      {tab.subetiqueta && (
                        <div className="text-[10px] opacity-75 font-normal">{tab.subetiqueta}</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Estilo 2: Pills Redondeadas */}
          {estiloTabs === 'pills' && (
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {tabs.map((tab, idx) => {
                const isActive = activeTab === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveTab(idx)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-azul-acropolis text-white border-azul-acropolis shadow-md'
                        : 'bg-white text-gris-texto border-gray-200 hover:border-azul-acropolis/40 hover:text-negro'
                    }`}
                  >
                    {tab.iconoEmoji && <span>{tab.iconoEmoji}</span>}
                    <span>{tab.etiqueta}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Estilo 3: Tabs con Subrayado Clásico */}
          {estiloTabs === 'subrayado' && (
            <div className="flex border-b border-gray-200 gap-4 sm:gap-8">
              {tabs.map((tab, idx) => {
                const isActive = activeTab === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveTab(idx)}
                    className={`pb-3 text-sm sm:text-base font-bold transition-all cursor-pointer relative ${
                      isActive
                        ? 'text-azul-acropolis font-extrabold'
                        : 'text-gris-texto hover:text-negro'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {tab.iconoEmoji && <span>{tab.iconoEmoji}</span>}
                      <span>{tab.etiqueta}</span>
                    </div>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-1 bg-azul-acropolis rounded-t-full" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Panel de Contenido Activo */}
        <div className="bg-white rounded-3xl border border-gray-200/90 shadow-sm p-6 sm:p-10 transition-all duration-300">
          <div className={`grid grid-cols-1 gap-8 sm:gap-12 items-center ${
            currentTab.imagenUrl && currentTab.posicionImagen !== 'sin_imagen'
              ? 'lg:grid-cols-12'
              : 'max-w-4xl mx-auto'
          }`}>
            {/* Imagen si está a la izquierda */}
            {currentTab.imagenUrl && currentTab.posicionImagen === 'izquierda' && (
              <div className="lg:col-span-5 relative order-last lg:order-first">
                <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden shadow-md border border-gray-200">
                  <Image
                    src={currentTab.imagenUrl}
                    alt={currentTab.tituloPanel || currentTab.etiqueta}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </div>
              </div>
            )}

            {/* Contenido de Texto */}
            <div className={`${
              currentTab.imagenUrl && currentTab.posicionImagen !== 'sin_imagen'
                ? 'lg:col-span-7'
                : 'w-full'
            }`}>
              {currentTab.subetiqueta && (
                <span className="inline-block px-3 py-1 rounded-md bg-azul-soft text-azul-acropolis text-xs font-bold uppercase tracking-wider mb-2 border border-azul-acropolis/20">
                  {currentTab.subetiqueta}
                </span>
              )}

              {currentTab.tituloPanel && (
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-negro mb-4 font-outfit leading-tight">
                  {currentTab.tituloPanel}
                </h3>
              )}

              {currentTab.contenidoHtml && (
                <div
                  className="prose max-w-none text-sm sm:text-base text-gris-texto leading-relaxed mb-6 [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>strong]:text-negro"
                  dangerouslySetInnerHTML={{ __html: currentTab.contenidoHtml }}
                />
              )}

              {/* Puntos Clave o Sellos si existen */}
              {currentTab.puntosClave && currentTab.puntosClave.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-6">
                  {currentTab.puntosClave.filter(Boolean).map((punto, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2 bg-gray-50/80 p-2.5 rounded-xl border border-gray-100">
                      <CheckCircle2 size={16} className="text-azul-acropolis shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm font-semibold text-negro">{punto}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Botón de Acción del Tab */}
              {currentTab.botonUrl && (
                <div className="pt-2">
                  <a
                    href={currentTab.botonUrl}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-azul-acropolis text-white font-bold text-sm hover:bg-azul-hover transition-all shadow-sm hover:shadow hover:-translate-y-0.5"
                  >
                    <span>{currentTab.botonTexto || 'Conocer Más'}</span>
                    <ArrowRight size={16} />
                  </a>
                </div>
              )}
            </div>

            {/* Imagen si está a la derecha (por defecto) */}
            {currentTab.imagenUrl && (currentTab.posicionImagen === 'derecha' || !currentTab.posicionImagen) && (
              <div className="lg:col-span-5 relative">
                <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden shadow-md border border-gray-200">
                  <Image
                    src={currentTab.imagenUrl}
                    alt={currentTab.tituloPanel || currentTab.etiqueta}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
