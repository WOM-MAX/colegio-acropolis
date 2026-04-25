import { createDirectiva } from '../actions';
import DirectivaForm from '../components/DirectivaForm';

export default function NuevaDirectivaPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-negro">
          Añadir Miembro de Directiva
        </h1>
        <p className="mt-1 text-gris-texto">
          Ingresa los datos del nuevo integrante del Centro de Padres.
        </p>
      </div>

      <DirectivaForm action={createDirectiva} />
    </div>
  );
}
