'use client';

import { useActionState, useEffect, useRef } from 'react';
import { sendContactMessage } from './actions';
import { Mail, MapPin, Phone } from 'lucide-react';

const initialState: { error: string | null; success: boolean } = { error: null, success: false };

export default function ContactoPage() {
  const [state, formAction, isPending] = useActionState(sendContactMessage, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <div className="py-16 px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-black tracking-tight text-negro sm:text-5xl">
            Ponte en <span className="text-fucsia">Contacto</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gris-texto">
            Estamos aquí para escucharte. Envíanos tu consulta y te responderemos a la brevedad.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Formulario */}
          <div className="rounded-3xl bg-white p-8 shadow-[var(--shadow-card)] sm:p-10">
            <h2 className="mb-6 text-2xl font-bold text-negro">Envíanos un mensaje</h2>
            
            {state.success ? (
              <div className="mb-6 rounded-2xl bg-green-50 p-6 text-center text-green-600 border border-green-200">
                <p className="text-lg font-bold mb-2">¡Mensaje enviado!</p>
                <p className="text-sm">Gracias por contactarnos. Responderemos a tu correo electrónico pronto.</p>
              </div>
            ) : (
              <form ref={formRef} action={formAction} className="space-y-5">
                {state.error && (
                  <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600 border border-red-200">{state.error}</p>
                )}
                
                {/* Honeypot anti-spam: Campo invisible para humanos, bots lo llenan automáticamente */}
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                </div>
                
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-negro">Tu Nombre</label>
                    <input
                      name="nombre"
                      type="text"
                      required
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
                      placeholder="Juan Pérez"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-negro">Correo Electrónico</label>
                    <input
                      name="email"
                      type="email"
                      required
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
                      placeholder="juan@ejemplo.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-negro">Asunto</label>
                  <input
                    name="asunto"
                    type="text"
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
                    placeholder="Consulta sobre matrícula..."
                  />
                </div>
                
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-negro">Mensaje</label>
                  <textarea
                    name="contenido"
                    required
                    rows={5}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
                    placeholder="Escribe tu mensaje aquí..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full rounded-[var(--radius-button)] bg-azul-acropolis px-8 py-4 px-4 font-semibold text-white transition-all hover:bg-azul-hover disabled:opacity-50"
                >
                  {isPending ? 'Enviando Mensaje...' : 'Enviar Mensaje'}
                </button>
              </form>
            )}
          </div>

          {/* Info Contacto */}
          <div className="flex flex-col justify-center gap-8 rounded-3xl bg-azul-acropolis p-8 text-white sm:p-12">
            <div>
              <h3 className="mb-2 text-2xl font-bold">Información de Contacto</h3>
              <p className="text-white/80">
                También puedes visitarnos presencialmente en nuestro horario de atención o utilizar nuestros canales directos.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <MapPin size={24} className="text-amarillo" />
                </div>
                <div>
                  <h4 className="font-bold">Ubicación</h4>
                  <p className="text-white/80">Juan de Dios Malebrán #1324</p>
                  <p className="text-white/80">Puente Alto, Santiago, Chile</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <Phone size={24} className="text-amarillo" />
                </div>
                <div>
                  <h4 className="font-bold">Teléfono</h4>
                  <p className="text-white/80">+56 2 2268 7654</p>
                  <p className="text-white/80">+56 9 1234 5678</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <Mail size={24} className="text-amarillo" />
                </div>
                <div>
                  <h4 className="font-bold">Correo Institucional</h4>
                  <p className="text-white/80">contacto@colegioacropolis.net</p>
                  <p className="text-white/80">admision@colegioacropolis.net</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 rounded-xl border border-white/20 bg-white/5 p-4 text-sm text-white/80 backdrop-blur">
              <strong>Horario de Atención:</strong><br />
              Lunes a Jueves: 08:30 - 17:30 hrs.<br />
              Viernes: 08:30 - 14:00 hrs.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
