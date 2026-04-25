'use client';

import { useState } from 'react';
import { UploadCloud, Loader2, CheckCircle2, AlertCircle, Images } from 'lucide-react';

interface BatchImageUploadProps {
  onImagesUploaded: (urls: { url: string; caption: string }[]) => void;
}

export default function BatchImageUpload({ onImagesUploaded }: BatchImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState(0);

  const handleMultipleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);
    setSuccessCount(0);
    setProgress({ current: 0, total: files.length });

    const uploadedImages: { url: string; caption: string }[] = [];
    let failCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgress({ current: i + 1, total: files.length });

      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          failCount++;
          continue;
        }

        const data = await res.json();
        if (data.url) {
          uploadedImages.push({ url: data.url, caption: '' });
        }
      } catch {
        failCount++;
      }
    }

    if (uploadedImages.length > 0) {
      onImagesUploaded(uploadedImages);
      setSuccessCount(uploadedImages.length);
    }

    if (failCount > 0) {
      setError(`${failCount} de ${files.length} imágenes no pudieron subirse.`);
    }

    setIsUploading(false);

    // Reset the input
    e.target.value = '';
  };

  return (
    <div className="rounded-xl border-2 border-dashed border-azul-acropolis/30 bg-azul-soft/20 p-4 transition-colors hover:border-azul-acropolis/50">
      <div className="flex flex-col items-center gap-3 text-center">
        {isUploading ? (
          <>
            <Loader2 size={28} className="text-azul-acropolis animate-spin" />
            <div className="w-full">
              <p className="text-sm font-semibold text-azul-acropolis">
                Subiendo {progress.current} de {progress.total}...
              </p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-azul-acropolis transition-all duration-300"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-azul-acropolis/10">
              <Images size={24} className="text-azul-acropolis" />
            </div>
            <div>
              <p className="text-sm font-semibold text-negro">Subida Masiva de Imágenes</p>
              <p className="text-xs text-gris-texto">Selecciona múltiples archivos a la vez</p>
            </div>
            <label className="cursor-pointer rounded-lg bg-azul-acropolis px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-azul-acropolis/90 hover:shadow-md">
              <span className="flex items-center gap-2">
                <UploadCloud size={14} />
                Seleccionar Imágenes
              </span>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleMultipleFiles}
                className="hidden"
              />
            </label>
            <p className="text-[10px] text-gris-texto">
              Formatos: .webp · .jpg · .png — Máx. 1 MB por imagen
            </p>
          </>
        )}

        {successCount > 0 && !isUploading && (
          <div className="mt-1 flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
            <CheckCircle2 size={14} />
            {successCount} {successCount === 1 ? 'imagen agregada' : 'imágenes agregadas'} exitosamente
          </div>
        )}

        {error && (
          <div className="mt-1 flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600">
            <AlertCircle size={14} />
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
