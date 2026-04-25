import { createPopup } from '../actions';
import PopupForm from '../components/PopupForm';

export default function NuevoPopupPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-negro">
          Nuevo Popup
        </h1>
        <p className="mt-1 text-gris-texto">
          Crea una nueva ventana emergente para la web.
        </p>
      </div>

      <PopupForm action={createPopup} />
    </div>
  );
}
