import React from 'react';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  FileSpreadsheet, 
  FileArchive, 
  Sparkles,
  ArrowDownToLine
} from 'lucide-react';

export type DocumentoItem = {
  titulo: string;
  descripcion?: string;
  archivoUrl: string;
  categoria?: string;
  peso?: string;
  formato?: 'pdf' | 'word' | 'excel' | 'zip' | 'general';
  destacado?: boolean;
  fechaActualizacion?: string;
};

export type DocumentosListaConfig = {
  tituloSeccion?: string;
  subtituloSeccion?: string;
  disenoVisual?: 'lista' | 'grilla';
  columnas?: '2' | '3' | '4';
  estiloFondo?: 'gris' | 'blanco' | 'azul';
  documentos?: DocumentoItem[];
};

export default function DocumentosListaBlock({ configuracion }: { configuracion: DocumentosListaConfig }) {
  const {
    tituloSeccion = '',
    subtituloSeccion = '',
    disenoVisual = 'lista',
    columnas = '3',
    estiloFondo = 'gris',
    documentos = [],
  } = configuracion;

  if (!documentos || documentos.length === 0) return null;

  const bgClasses: Record<string, string> = {
    gris: 'bg-gris-claro border-y border-gray-200/80',
    blanco: 'bg-white border-y border-gray-100',
    azul: 'bg-azul-soft/50 border-y border-azul-acropolis/20',
  };
  const sectionBg = bgClasses[estiloFondo] || bgClasses.gris;

  const colsClass = {
    '2': 'md:grid-cols-2',
    '3': 'md:grid-cols-2 lg:grid-cols-3',
    '4': 'md:grid-cols-2 lg:grid-cols-4',
  }[columnas] || 'md:grid-cols-3';

  // Helper para detectar formato por extensión o configuración
  const getFormatInfo = (doc: DocumentoItem) => {
    const url = (doc.archivoUrl || '').toLowerCase();
    const explicit = doc.formato;

    if (explicit === 'pdf' || url.endsWith('.pdf')) {
      return {
        label: 'PDF',
        icon: <FileText size={20} className="text-red-600" />,
        badgeBg: 'bg-red-50 text-red-700 border-red-200',
        iconBg: 'bg-red-50 text-red-600 border-red-100',
      };
    }
    if (explicit === 'word' || url.endsWith('.doc') || url.endsWith('.docx')) {
      return {
        label: 'DOC',
        icon: <FileText size={20} className="text-blue-600" />,
        badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
        iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
      };
    }
    if (explicit === 'excel' || url.endsWith('.xls') || url.endsWith('.xlsx')) {
      return {
        label: 'XLS',
        icon: <FileSpreadsheet size={20} className="text-emerald-600" />,
        badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      };
    }
    if (explicit === 'zip' || url.endsWith('.zip') || url.endsWith('.rar')) {
      return {
        label: 'ZIP',
        icon: <FileArchive size={20} className="text-amber-600" />,
        badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
        iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
      };
    }

    return {
      label: 'DOC',
      icon: <FileText size={20} className="text-azul-acropolis" />,
      badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
      iconBg: 'bg-azul-soft text-azul-acropolis border-blue-100',
    };
  };

  return (
    <section className={`py-14 sm:py-20 ${sectionBg} relative overflow-hidden`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Encabezado de Sección */}
        {(tituloSeccion || subtituloSeccion) && (
          <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-16">
            {tituloSeccion && (
              <div
                className="text-2xl sm:text-3xl font-bold tracking-tight text-negro mb-2 leading-tight [&_*]:text-2xl sm:[&_*]:text-3xl [&_*]:font-bold [&_*]:tracking-tight [&_*]:text-negro [&_*]:m-0 [&_*]:leading-tight"
                dangerouslySetInnerHTML={{ __html: tituloSeccion }}
              />
            )}
            {subtituloSeccion && (
              <div
                className="text-sm sm:text-base text-gris-texto max-w-xl mx-auto [&_p]:m-0 mt-2"
                dangerouslySetInnerHTML={{ __html: subtituloSeccion }}
              />
            )}
            {/* Línea decorativa Acrópolis */}
            <div className="mt-3.5 flex justify-center items-center">
              <div className="w-10 h-1 bg-amarillo rounded-full" />
              <div className="w-3.5 h-1 bg-azul-acropolis rounded-full ml-1.5" />
            </div>
          </div>
        )}

        {/* Modo 1: Lista Compacta (Sleek Rows) */}
        {disenoVisual === 'lista' ? (
          <div className="max-w-5xl mx-auto flex flex-col gap-3.5">
            {documentos.map((doc, index) => {
              const fmt = getFormatInfo(doc);
              const isExternal = doc.archivoUrl.startsWith('http');

              return (
                <div
                  key={index}
                  className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-200/80 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(70,97,246,0.08)] hover:border-azul-acropolis/40"
                >
                  {/* Lado izquierdo: Icono + Detalles */}
                  <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${fmt.iconBg} shadow-2xs group-hover:scale-105 transition-transform`}>
                      {fmt.icon}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-extrabold tracking-wider ${fmt.badgeBg}`}>
                          {fmt.label}
                        </span>

                        {doc.categoria && (
                          <span className="inline-flex items-center rounded-md border border-azul-acropolis/20 bg-azul-soft/60 px-2 py-0.5 text-[10px] font-bold text-azul-acropolis tracking-wide">
                            {doc.categoria}
                          </span>
                        )}

                        {doc.destacado && (
                          <span className="inline-flex items-center gap-1 rounded-md border border-amber-300 bg-amber-50 px-2 py-0.5 text-[10px] font-black text-amber-800 animate-pulse">
                            <Sparkles size={11} className="text-amber-600" />
                            NUEVO
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug group-hover:text-azul-acropolis transition-colors">
                        {doc.titulo}
                      </h4>

                      {doc.descripcion && (
                        <p className="text-xs text-gris-texto mt-0.5 leading-relaxed line-clamp-1">
                          {doc.descripcion}
                        </p>
                      )}

                      {(doc.peso || doc.fechaActualizacion) && (
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1 font-medium">
                          {doc.peso && <span>{doc.peso}</span>}
                          {doc.peso && doc.fechaActualizacion && <span>•</span>}
                          {doc.fechaActualizacion && <span>Actualizado: {doc.fechaActualizacion}</span>}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Lado derecho: Botón de Descarga */}
                  <div className="shrink-0 flex items-center justify-end sm:pl-4 sm:border-l sm:border-gray-100">
                    <a
                      href={doc.archivoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={!isExternal}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-azul-acropolis px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:bg-azul-oscuro hover:shadow-md hover:scale-[1.02] active:scale-95 w-full sm:w-auto"
                    >
                      <ArrowDownToLine size={15} />
                      <span>Descargar</span>
                      <ExternalLink size={12} className="opacity-70" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Modo 2: Grilla de Tarjetas 3D */
          <div className={`grid grid-cols-1 gap-6 ${colsClass}`}>
            {documentos.map((doc, index) => {
              const fmt = getFormatInfo(doc);
              const isExternal = doc.archivoUrl.startsWith('http');

              return (
                <div
                  key={index}
                  className="group relative flex flex-col justify-between rounded-2xl bg-white p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-200/80 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(70,97,246,0.12)] hover:border-azul-acropolis/40"
                >
                  <div>
                    {/* Cabecera de la tarjeta */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${fmt.iconBg} shadow-2xs group-hover:scale-105 transition-transform`}>
                        {fmt.icon}
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap justify-end">
                        <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-extrabold tracking-wider ${fmt.badgeBg}`}>
                          {fmt.label}
                        </span>

                        {doc.destacado && (
                          <span className="inline-flex items-center gap-1 rounded-md border border-amber-300 bg-amber-50 px-1.5 py-0.5 text-[10px] font-black text-amber-800 animate-pulse">
                            <Sparkles size={10} className="text-amber-600" />
                            NUEVO
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Categoría */}
                    {doc.categoria && (
                      <p className="text-[11px] font-bold uppercase tracking-wider text-azul-acropolis mb-1.5">
                        {doc.categoria}
                      </p>
                    )}

                    {/* Título */}
                    <h4 className="text-base font-bold text-slate-900 leading-snug mb-2 group-hover:text-azul-acropolis transition-colors">
                      {doc.titulo}
                    </h4>

                    {/* Descripción */}
                    {doc.descripcion && (
                      <p className="text-xs text-gris-texto leading-relaxed line-clamp-3 mb-4">
                        {doc.descripcion}
                      </p>
                    )}
                  </div>

                  {/* Pie de tarjeta con metadatos y botón */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                    {(doc.peso || doc.fechaActualizacion) && (
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                        {doc.peso && <span>Peso: {doc.peso}</span>}
                        {doc.fechaActualizacion && <span>{doc.fechaActualizacion}</span>}
                      </div>
                    )}

                    <a
                      href={doc.archivoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={!isExternal}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-azul-acropolis px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:bg-azul-oscuro hover:shadow-md hover:scale-[1.02] active:scale-95"
                    >
                      <Download size={14} />
                      <span>Descargar Documento</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
