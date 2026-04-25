export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';
import { matriculaConfig } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import MatriculaForm from './components/MatriculaForm';
import { updateMatriculaConfig } from './actions';

export default async function MatriculaPage() {
  const result = await db.select().from(matriculaConfig).where(eq(matriculaConfig.id, 1));
  const config = result[0] || null;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-negro">
          Enrolamiento y Matrícula
        </h1>
        <p className="mt-1 text-sm text-gris-texto">
          Configura los enlaces, fechas y estado de la matrícula de acuerdo a los plazos del SAE (Sistema de Admisión Escolar).
        </p>
      </div>

      <MatriculaForm initialData={config as any} action={updateMatriculaConfig} />
    </div>
  );
}
