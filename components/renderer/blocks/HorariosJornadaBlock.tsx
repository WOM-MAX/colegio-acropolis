import React from 'react';
import { 
  Clock, 
  Calendar, 
  AlertCircle, 
  Sun, 
  Sunrise, 
  Sunset,
  Info
} from 'lucide-react';

export type FilaHorario = {
  diaOPeriodo: string;
  entrada: string;
  salida: string;
  recreoAlmuerzo?: string;
  observacion?: string;
};

export type TarjetaJornada = {
  tituloNivel: string;
  subtituloJornada?: string;
  iconoEmoji?: string;
  colorBorde?: 'azul' | 'amarillo' | 'fucsia' | 'verde';
  filas?: FilaHorario[];
  notaPie?: string;
};

export type HorariosJornadaConfig = {
  tituloSeccion?: string;
  subtituloSeccion?: string;
  estiloFondo?: 'gris' | 'blanco' | 'azul';
  columnas?: '2' | '3';
  jornadas?: TarjetaJornada[];
  avisoGeneral?: string;
};

export default function HorariosJornadaBlock({ configuracion }: { configuracion: HorariosJornadaConfig }) {
  const {
    tituloSeccion = '',
    subtituloSeccion = '',
    estiloFondo = 'gris',
    columnas = '3',
    jornadas = [],
    avisoGeneral = '',
  } = configuracion;

  if (!jornadas || jornadas.length === 0) return null;

  const bgClasses: Record<string, string> = {
    gris: 'bg-gris-claro border-y border-gray-200/80',
    blanco: 'bg-white border-y border-gray-100',
    azul: 'bg-azul-soft/50 border-y border-azul-acropolis/20',
  };
  const sectionBg = bgClasses[estiloFondo] || bgClasses.gris;

  const getBorderColorClass = (color?: string) => {
    switch (color) {
      case 'amarillo':
        return 'border-t-amarillo-acropolis';
      case 'fucsia':
        return 'border-t-fucsia';
      case 'verde':
        return 'border-t-emerald-500';
      case 'azul':
      default:
        return 'border-t-azul-acropolis';
    }
  };

  const colsClass = columnas === '2' ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3';

  return (
    <section className={`py-14 sm:py-20 transition-colors ${sectionBg}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Cabecera de la sección */}
        {(tituloSeccion || subtituloSeccion) && (
          <div className="mb-12 text-center max-w-3xl mx-auto">
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

        {/* Grilla de Tarjetas de Horarios */}
        <div className={`grid grid-cols-1 ${colsClass} gap-6 sm:gap-8`}>
          {jornadas.map((jornada, idx) => (
            <div
              key={idx}
              className={`flex flex-col justify-between bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border-t-4 ${getBorderColorClass(
                jornada.colorBorde
              )}`}
            >
              <div>
                {/* Cabecera de la tarjeta */}
                <div className="p-5 sm:p-6 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-azul-soft text-azul-acropolis text-xl shrink-0 shadow-xs border border-azul-acropolis/10">
                      {jornada.iconoEmoji || '🎒'}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-bold text-base sm:text-lg text-negro leading-tight font-outfit truncate">
                        {jornada.tituloNivel}
                      </h3>
                      {jornada.subtituloJornada && (
                        <p className="text-xs font-semibold text-azul-acropolis mt-0.5">
                          {jornada.subtituloJornada}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tabla de Filas de Horario */}
                <div className="p-5 sm:p-6 space-y-3">
                  {(jornada.filas || []).map((fila, fIdx) => (
                    <div
                      key={fIdx}
                      className="bg-gray-50/90 rounded-xl p-3.5 border border-gray-200/70 hover:border-azul-acropolis/30 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-extrabold text-negro uppercase tracking-wider">
                          {fila.diaOPeriodo}
                        </span>
                        {fila.recreoAlmuerzo && (
                          <span className="text-[11px] text-gris-texto bg-white px-2 py-0.5 rounded-md border border-gray-200/80 font-medium">
                            🍽️ Almuerzo: {fila.recreoAlmuerzo}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-200/50">
                        <div className="flex items-center gap-1.5 text-xs text-negro">
                          <Sunrise size={15} className="text-amber-500 shrink-0" />
                          <span>Entrada:</span>
                          <strong className="font-bold text-azul-acropolis font-mono">{fila.entrada}</strong>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-negro justify-end">
                          <Sunset size={15} className="text-rose-500 shrink-0" />
                          <span>Salida:</span>
                          <strong className="font-bold text-negro font-mono">{fila.salida}</strong>
                        </div>
                      </div>

                      {fila.observacion && (
                        <p className="text-[11px] text-gris-texto mt-2 pt-1.5 border-t border-gray-200/40 italic">
                          {fila.observacion}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Nota al pie de la tarjeta */}
              {jornada.notaPie && (
                <div className="p-4 bg-gray-50/70 border-t border-gray-100 text-xs text-gris-texto leading-relaxed flex items-start gap-2">
                  <Info size={14} className="text-azul-acropolis shrink-0 mt-0.5" />
                  <span>{jornada.notaPie}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Aviso General Inferior */}
        {avisoGeneral && (
          <div className="mt-10 rounded-2xl bg-amber-50/90 border border-amber-200/90 p-5 flex items-start gap-3 max-w-3xl mx-auto shadow-2xs">
            <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-amber-950 leading-relaxed font-medium">
              {avisoGeneral}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
