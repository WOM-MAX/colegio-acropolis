import { db } from '@/lib/db';
import { popups } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { updatePopup } from '../../actions';
import PopupForm from '../../components/PopupForm';
import { notFound } from 'next/navigation';

export default async function EditarPopupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const popupId = parseInt(id, 10);

  let popup;
  try {
    const result = await db.select().from(popups).where(eq(popups.id, popupId));
    popup = result[0];
  } catch (error) {
    console.error(error);
  }

  if (!popup) {
    notFound();
  }

  const updatePopupWithId = updatePopup.bind(null, popup.id);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-negro">
          Editar Popup
        </h1>
        <p className="mt-1 text-gris-texto">
          Modifica los detalles de la ventana emergente.
        </p>
      </div>

      <PopupForm initialData={popup} action={updatePopupWithId} />
    </div>
  );
}
