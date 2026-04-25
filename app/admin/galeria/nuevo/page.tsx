import { createAlbum } from '../actions';
import AlbumForm from '../components/AlbumForm';

export default function NuevoAlbumPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-negro">
          Nuevo Álbum
        </h1>
        <p className="mt-1 text-gris-texto">
          Crea un nuevo álbum para organizar las fotografías del colegio.
        </p>
      </div>

      <AlbumForm action={createAlbum} />
    </div>
  );
}
