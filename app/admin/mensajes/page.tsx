export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';
import { mensajesContacto } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { formatDateShort } from '@/lib/utils';
import { toggleMensajeLeido, deleteMensaje } from './actions';
import { CheckCircle2, Circle } from 'lucide-react';
import DeleteFormButton from '@/app/admin/components/DeleteFormButton';

export default async function MensajesPage() {
  const mensajes = await db.select().from(mensajesContacto).orderBy(desc(mensajesContacto.createdAt));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-negro">
          Bandeja de Mensajes
        </h1>
        <p className="mt-1 text-sm text-gris-texto">
          Mensajes recibidos desde el formulario de contacto del portal web.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {mensajes.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center text-gris-texto shadow-[var(--shadow-card)]">
            No hay mensajes en la bandeja.
          </div>
        ) : (
          mensajes.map((msj) => (
            <div
              key={msj.id}
              className={`rounded-2xl border-l-4 p-5 shadow-[var(--shadow-card)] transition-colors ${
                msj.leido ? 'border-gray-300 bg-white' : 'border-azul-acropolis bg-azul-soft'
              }`}
            >
              <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <h3 className="text-lg font-bold text-negro">
                    {msj.asunto}
                  </h3>
                  <p className="text-sm text-gris-texto">
                    De: <span className="font-semibold text-negro">{msj.nombre}</span> ({msj.email})
                    {msj.telefono && ` - Tel: ${msj.telefono}`}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-xs font-medium text-gray-500">
                    {formatDateShort(msj.createdAt.toISOString().split('T')[0])}
                  </span>
                  
                  <form action={toggleMensajeLeido.bind(null, msj.id, !msj.leido)}>
                    <button
                      type="submit"
                      title={msj.leido ? 'Marcar como no leído' : 'Marcar como leído'}
                      className={`rounded-full p-1.5 transition-colors ${
                        msj.leido
                          ? 'text-gray-400 hover:bg-gray-200 hover:text-gray-600'
                          : 'text-azul-acropolis hover:bg-azul-acropolis/20'
                      }`}
                    >
                      {msj.leido ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                    </button>
                  </form>

                  <DeleteFormButton
                    id={msj.id}
                    action={deleteMensaje}
                    confirmMessage="¿Seguro quieres eliminar este mensaje?"
                  />
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 p-4 font-sans text-sm text-negro md:text-base">
                <p className="whitespace-pre-wrap">{msj.mensaje}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
