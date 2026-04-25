import Link from 'next/link';
import { Send } from 'lucide-react';
import { db } from '@/lib/db';
import { configuracionSitio } from '@/lib/db/schema';

export default async function BannerCTA() {
  const configRows = await db.select().from(configuracionSitio).limit(1);
  const globalConfig = configRows[0];
  const correos = globalConfig?.emails as any[] || [];
  const mainEmail = correos.length > 0 ? correos[0].email : 'contacto@colegioacropolis.net';

  return (
    <section id="contacto" className="py-16 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl bg-fucsia px-8 py-16 text-center text-white sm:px-16 sm:py-20">
          {/* Forma orgánica amarilla decorativa */}
          <div className="absolute left-8 top-1/2 hidden -translate-y-1/2 lg:block">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-amarillo/30">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amarillo/50">
                <Send size={28} className="text-white" />
              </div>
            </div>
          </div>

          {/* Decoración circular derecha */}
          <div className="absolute -right-6 -top-6 hidden h-32 w-32 rounded-full bg-white/10 lg:block" />
          <div className="absolute -bottom-4 right-20 hidden h-16 w-16 rounded-full bg-amarillo/20 lg:block" />

          <h2 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
            ¿Tiene alguna consulta?
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-lg text-white/85">
            Estamos aquí para ayudarle. Contáctenos y le responderemos a la brevedad.
          </p>
          <Link
            href={`mailto:${mainEmail}`}
            className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-cian px-10 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition-all duration-200 hover:-translate-y-1 hover:bg-cian-hover hover:shadow-xl"
          >
            <Send size={18} />
            Escríbanos
          </Link>
        </div>
      </div>
    </section>
  );
}
