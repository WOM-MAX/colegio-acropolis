export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';
import { matriculaConfig } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';

export const metadata = {
  title: 'Admisión y Matrícula',
  description: 'Proceso de admisión, postulaciones SAE y matrículas para alumnos antiguos y nuevos.',
};

export default async function AdmisionPage() {
  let config: {
    activo: boolean;
    periodoAntiguosInicio: string | null;
    periodoAntiguosFin: string | null;
    periodoNuevosInicio: string | null;
    periodoNuevosFin: string | null;
    enlaceFormularioAntiguos: string | null;
    enlaceFormularioNuevos: string | null;
    mensajeInformativo: string | null;
    mensajesAntiguos: any;
    mensajesNuevos: any;
  } | null = null;

  try {
    const result = await db.select().from(matriculaConfig).where(eq(matriculaConfig.id, 1));
    config = result[0] || null;
  } catch (error) {
    console.error('Error al obtener config matrícula:', error);
    config = null;
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Fecha por definir';
    const parts = dateStr.split('-');
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  const isDentroDelPlazo = (inicio: string | null, fin: string | null) => {
    if (!inicio || !fin) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateInicio = new Date(inicio + 'T00:00:00');
    const dateFin = new Date(fin + 'T23:59:59');
    return today >= dateInicio && today <= dateFin;
  };

  return (
    <>
      <PageHero 
        title="Proceso de" 
        highlight="Admisión y Matrícula" 
        description="Conoce las fechas, pasos y formularios para asegurar tu cupo en nuestra comunidad educativa." 
      />
      <div className="bg-white py-16 px-6 sm:py-24">
        <div className="mx-auto max-w-4xl">        {/* Información general SAE */}
        <div className="mb-12 rounded-3xl bg-white p-8 shadow-[var(--shadow-card)] sm:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-10">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-azul-soft text-azul-acropolis">
              <span className="text-2xl font-black">SAE</span>
            </div>
            <div>
              <h2 className="mb-4 text-2xl font-bold text-negro">Sistema de Admisión Escolar</h2>
              <p className="mb-6 leading-relaxed text-gris-texto">
                La postulación para todos los <strong>estudiantes nuevos</strong> a establecimientos municipales y particulares subvencionados, 
                se realiza exclusivamente a través de la plataforma del Sistema de Admisión Escolar (SAE) del Ministerio de Educación de Chile.
              </p>
              <a 
                href="https://www.sistemadeadmisionescolar.cl/" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-azul-acropolis px-6 py-3 font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-azul-hover hover:shadow-lg"
              >
                Postular mediante SAE
                <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </div>

        {config?.activo ? (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-negro">
                Formularios de Enrolamiento
              </h2>
              <p className="text-gris-texto">
                Si tu estudiante ya fue aceptado o es alumno regular, completa la ficha oficial.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Estudiantes Antiguos */}
              <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white p-8 shadow-[var(--shadow-card)] border-t-4 border-fucsia">
                <div>
                  <h3 className="mb-2 text-xl font-bold text-negro">Alumnos Antiguos</h3>
                  <div className="mb-6 flex items-center gap-2 text-sm text-gris-texto">
                    Plazo: <span className="font-semibold text-negro">{formatDate(config.periodoAntiguosInicio)} - {formatDate(config.periodoAntiguosFin)}</span>
                  </div>
                  
                  <ul className="mb-8 space-y-3">
                    {Array.isArray(config.mensajesAntiguos) && config.mensajesAntiguos.length > 0 ? (
                      config.mensajesAntiguos.map((msg, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gris-texto">
                          <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-fucsia" />
                          {msg}
                        </li>
                      ))
                    ) : (
                      <>
                        <li className="flex items-start gap-2 text-sm text-gris-texto">
                          <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-fucsia" />
                          Actualización de ficha médica
                        </li>
                        <li className="flex items-start gap-2 text-sm text-gris-texto">
                          <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-fucsia" />
                          Aceptación del RIE anual
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                {config.enlaceFormularioAntiguos && isDentroDelPlazo(config.periodoAntiguosInicio, config.periodoAntiguosFin) ? (
                  <a
                    href={config.enlaceFormularioAntiguos}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-negro px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-negro/90"
                  >
                    Llenar Ficha de Matrícula
                  </a>
                ) : (
                  <button disabled className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-gray-100 px-6 py-3.5 text-sm font-semibold text-gray-400">
                    Fuera de Plazo
                  </button>
                )}
              </div>

              {/* Estudiantes Nuevos */}
              <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white p-8 shadow-[var(--shadow-card)] border-t-4 border-cian">
                <div>
                  <h3 className="mb-2 text-xl font-bold text-negro">Alumnos Nuevos</h3>
                  <div className="mb-6 flex items-center gap-2 text-sm text-gris-texto">
                    Plazo: <span className="font-semibold text-negro">{formatDate(config.periodoNuevosInicio)} - {formatDate(config.periodoNuevosFin)}</span>
                  </div>
                  
                  <ul className="mb-8 space-y-3">
                    {Array.isArray(config.mensajesNuevos) && config.mensajesNuevos.length > 0 ? (
                      config.mensajesNuevos.map((msg, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gris-texto">
                          <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-cian" />
                          {msg}
                        </li>
                      ))
                    ) : (
                      <>
                        <li className="flex items-start gap-2 text-sm text-gris-texto">
                          <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-cian" />
                          Ingreso de antecedentes familiares
                        </li>
                        <li className="flex items-start gap-2 text-sm text-gris-texto">
                          <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-cian" />
                          Aceptado previamente vía SAE
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                {config.enlaceFormularioNuevos && isDentroDelPlazo(config.periodoNuevosInicio, config.periodoNuevosFin) ? (
                  <a
                    href={config.enlaceFormularioNuevos}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-negro px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-negro/90"
                  >
                    Llenar Ficha de Matrícula
                  </a>
                ) : (
                  <button disabled className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-gray-100 px-6 py-3.5 text-sm font-semibold text-gray-400">
                    Fuera de Plazo
                  </button>
                )}
              </div>
            </div>

            {config.mensajeInformativo && (
              <div className="mt-8 rounded-2xl bg-amarillo-soft p-6 text-amarillo-hover border border-amarillo/30">
                <div className="flex gap-4">
                  <AlertCircle size={24} className="shrink-0" />
                  <div className="text-sm font-medium leading-relaxed">
                    {config.mensajeInformativo.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-3xl bg-white p-12 text-center shadow-[var(--shadow-card)]">
            <h3 className="mb-2 text-xl font-bold text-negro">Proceso de Matrícula Cerrado</h3>
            <p className="text-gris-texto">
              En este momento no nos encontramos en período de matrícula o enrolamiento. 
              Mantente atento a nuestros comunicados oficiales.
            </p>
          </div>
        )}

      </div>
    </div>
    </>
  );
}
