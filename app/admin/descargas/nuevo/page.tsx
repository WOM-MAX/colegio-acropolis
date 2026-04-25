import { createDescarga } from '../actions';
import DescargaForm from '../components/DescargaForm';
import { db } from '@/lib/db';
import { descargasCategorias } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export default async function NuevaDescargaPage() {
  const categorias = await db.query.descargasCategorias.findMany({
    orderBy: [desc(descargasCategorias.orden)],
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-negro">
          Nuevo Documento / Descarga
        </h1>
        <p className="mt-1 text-gris-texto">
          Agrega un archivo accesible públicamente para la comunidad escolar.
        </p>
      </div>

      <DescargaForm categorias={categorias} action={createDescarga} />
    </div>
  );
}
