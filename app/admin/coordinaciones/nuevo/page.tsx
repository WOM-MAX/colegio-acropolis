import { createCoordinacion } from '../actions';
import CoordinacionForm from '../components/CoordinacionForm';

export default function NuevaCoordinacionPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-negro">
          Nueva Coordinación
        </h1>
        <p className="mt-1 text-gris-texto">
          Agrega una nueva unidad o coordinación del colegio.
        </p>
      </div>

      <CoordinacionForm action={createCoordinacion} />
    </div>
  );
}
