import { createEvento } from '../actions';
import EventoForm from '../components/EventoForm';

export default function NuevoEventoPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-negro">
          Nuevo Evento
        </h1>
        <p className="mt-1 text-gris-texto">
          Registra una actividad o fecha importante en el colegio.
        </p>
      </div>

      <EventoForm action={createEvento} />
    </div>
  );
}
