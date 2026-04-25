'use client';

import { useState } from 'react';

interface MatriculaData {
  periodoNuevosInicio: string | null;
  periodoNuevosFin: string | null;
  periodoAntiguosInicio: string | null;
  periodoAntiguosFin: string | null;
  enlaceFormularioNuevos: string | null;
  enlaceFormularioAntiguos: string | null;
  mensajeInformativo: string | null;
  mensajesAntiguos?: string[];
  mensajesNuevos?: string[];
  activo: boolean;
}

export default function MatriculaForm({
  initialData,
  action,
}: {
  initialData: MatriculaData | null;
  action: (formData: FormData) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const data = initialData || {
    periodoNuevosInicio: null,
    periodoNuevosFin: null,
    periodoAntiguosInicio: null,
    periodoAntiguosFin: null,
    enlaceFormularioNuevos: '',
    enlaceFormularioAntiguos: '',
    mensajeInformativo: '',
    mensajesAntiguos: [],
    mensajesNuevos: [],
    activo: false,
  };

  const [activo, setActivo] = useState(data.activo);

  return (
    <form
      action={async (formData) => {
        setLoading(true);
        setSaveSuccess(false);
        formData.set('activo', activo.toString());
        await action(formData);
        setLoading(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }}
      className="rounded-2xl bg-white p-6 shadow-[var(--shadow-card)] lg:p-8"
    >
      <div className="mb-6 flex items-center justify-between rounded-xl bg-gray-50 p-4">
        <div>
          <h3 className="font-semibold text-negro">Habilitar Matrícula Mineduc / SAE</h3>
          <p className="text-sm text-gris-texto">
            Activa el portal público de matrículas para apoderados una vez que terminan las postulaciones en el SAE.
          </p>
        </div>
        <label className="flex cursor-pointer items-center gap-3">
          <span className="text-sm font-medium text-negro">
            {activo ? 'ACTIVADO' : 'DESACTIVADO'}
          </span>
          <input
            type="checkbox"
            checked={activo}
            onChange={(e) => setActivo(e.target.checked)}
            className="h-5 w-5 rounded border-gray-300 text-azul-acropolis focus:ring-azul-acropolis"
          />
        </label>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <h4 className="border-b border-gray-200 pb-2 text-lg font-bold text-negro">
            Estudiantes Nuevos (SAE)
          </h4>
        </div>
        
        <div>
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Enlace de Formulario (Google Forms, etc) *
          </label>
          <input
            name="enlaceFormularioNuevos"
            type="url"
            defaultValue={data.enlaceFormularioNuevos || ''}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
            placeholder="https://forms.gle/..."
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-negro">
              Fecha de Inicio
            </label>
            <input
              name="periodoNuevosInicio"
              type="date"
              defaultValue={data.periodoNuevosInicio || ''}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-negro">
              Fecha de Término
            </label>
            <input
              name="periodoNuevosFin"
              type="date"
              defaultValue={data.periodoNuevosFin || ''}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
            />
          </div>
        </div>

        <div className="mt-2 md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Mensajes / Viñetas (Uno por línea)
          </label>
          <textarea
            name="mensajesNuevos"
            defaultValue={(data.mensajesNuevos || []).join('\n')}
            rows={3}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
            placeholder="Ingreso de antecedentes familiares&#10;Aceptado previamente vía SAE"
          />
        </div>

        <div className="mt-4 md:col-span-2">
          <h4 className="border-b border-gray-200 pb-2 text-lg font-bold text-negro">
            Estudiantes Antiguos
          </h4>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Enlace de Formulario (Google Forms, etc) *
          </label>
          <input
            name="enlaceFormularioAntiguos"
            type="url"
            defaultValue={data.enlaceFormularioAntiguos || ''}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
            placeholder="https://forms.gle/..."
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-negro">
              Fecha de Inicio
            </label>
            <input
              name="periodoAntiguosInicio"
              type="date"
              defaultValue={data.periodoAntiguosInicio || ''}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-negro">
              Fecha de Término
            </label>
            <input
              name="periodoAntiguosFin"
              type="date"
              defaultValue={data.periodoAntiguosFin || ''}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
            />
          </div>
        </div>

        <div className="mt-2 md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Mensajes / Viñetas (Uno por línea)
          </label>
          <textarea
            name="mensajesAntiguos"
            defaultValue={(data.mensajesAntiguos || []).join('\n')}
            rows={3}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
            placeholder="Actualización de ficha médica&#10;Aceptación del RIE anual"
          />
        </div>

        {/* Mensaje Informativo */}
        <div className="mt-4 md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-negro">
            Mensaje o Instrucciones Especiales
          </label>
          <textarea
            name="mensajeInformativo"
            defaultValue={data.mensajeInformativo || ''}
            rows={4}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
            placeholder="Documentos requeridos a llevar el día de la matrícula (Certificado de notas, cédula, etc)..."
          />
        </div>
      </div>

      <div className="flex items-center gap-4 border-t border-gray-200 pt-6">
        <button
          type="submit"
          disabled={loading}
          className="rounded-[var(--radius-button)] bg-azul-acropolis px-8 py-3 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-azul-hover hover:shadow-lg disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {loading ? 'Guardando...' : 'Guardar Configuración'}
        </button>
        {saveSuccess && (
          <span className="text-sm font-medium text-green-600">
            ✓ Cambios guardados correctamente
          </span>
        )}
      </div>
    </form>
  );
}
