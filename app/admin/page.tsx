export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';
import { journal, eventos, popups, mensajesContacto, descargas } from '@/lib/db/schema';
import { eq, and, gte, lte, count } from 'drizzle-orm';
import {
  Newspaper,
  CalendarDays,
  Bell,
  Mail,
  FileDown,
  Clock,
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

function MetricCard({ title, value, icon, color, bgColor }: MetricCardProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gris-texto">{title}</p>
          <p className="mt-2 text-4xl font-bold tracking-tight" style={{ color }}>
            {value}
          </p>
        </div>
        <div
          className="rounded-xl p-3"
          style={{ backgroundColor: bgColor, color }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const today = new Date().toISOString().split('T')[0];
  const monthStart = today.substring(0, 7) + '-01';

  let metrics = {
    journalCount: 0,
    eventosActivos: 0,
    popupsActivos: 0,
    mensajesSinLeer: 0,
    descargasCount: 0,
  };

  try {
    const [journalResult, eventosResult, popupsResult, mensajesResult, descargasResult] =
      await Promise.all([
        db.select({ value: count() }).from(journal).where(eq(journal.publicado, true)),
        db.select({ value: count() }).from(eventos).where(and(eq(eventos.activo, true), gte(eventos.fecha, monthStart))),
        db.select({ value: count() }).from(popups).where(and(eq(popups.activo, true), lte(popups.fechaInicio, today), gte(popups.fechaFin, today))),
        db.select({ value: count() }).from(mensajesContacto).where(eq(mensajesContacto.leido, false)),
        db.select({ value: count() }).from(descargas),
      ]);

    metrics = {
      journalCount: journalResult[0]?.value ?? 0,
      eventosActivos: eventosResult[0]?.value ?? 0,
      popupsActivos: popupsResult[0]?.value ?? 0,
      mensajesSinLeer: mensajesResult[0]?.value ?? 0,
      descargasCount: descargasResult[0]?.value ?? 0,
    };
  } catch (error) {
    console.error('Error al cargar métricas:', error);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-negro">
          Panel de Control
        </h1>
        <p className="mt-1 text-gris-texto">
          Bienvenido al panel administrativo del Colegio Acrópolis
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Noticias Publicadas"
          value={metrics.journalCount}
          icon={<Newspaper size={24} />}
          color="var(--color-azul-acropolis)"
          bgColor="var(--color-azul-soft)"
        />
        <MetricCard
          title="Eventos Activos (mes)"
          value={metrics.eventosActivos}
          icon={<CalendarDays size={24} />}
          color="var(--color-fucsia)"
          bgColor="var(--color-fucsia-soft)"
        />
        <MetricCard
          title="Popups Activos"
          value={metrics.popupsActivos}
          icon={<Bell size={24} />}
          color="var(--color-cian)"
          bgColor="var(--color-cian-soft)"
        />
        <MetricCard
          title="Mensajes Sin Leer"
          value={metrics.mensajesSinLeer}
          icon={<Mail size={24} />}
          color="var(--color-amarillo-hover)"
          bgColor="var(--color-amarillo-soft)"
        />
        <MetricCard
          title="Descargas Disponibles"
          value={metrics.descargasCount}
          icon={<FileDown size={24} />}
          color="var(--color-gris-texto)"
          bgColor="var(--color-gris-claro)"
        />
        <MetricCard
          title="Última Actualización"
          value={new Date().getDate()}
          icon={<Clock size={24} />}
          color="var(--color-azul-acropolis)"
          bgColor="var(--color-azul-soft)"
        />
      </div>

      <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-gris-texto">
          Seleccione un módulo en la barra lateral para gestionar el contenido del sitio.
        </p>
      </div>
    </div>
  );
}
