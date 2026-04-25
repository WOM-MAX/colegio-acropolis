'use client';

import { useState, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { UploadCloud, Film, ImagePlus, X } from 'lucide-react';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface GaleriaItemFormProps {
  albumId: number;
  addSingleAction: (formData: FormData) => Promise<void>;
  addMultipleAction: (formData: FormData) => Promise<void>;
}

export default function GaleriaItemForm({ albumId, addSingleAction, addMultipleAction }: GaleriaItemFormProps) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [mode, setMode] = useState<'fotos' | 'video'>('fotos');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  // Filter only accepted image files
  const filterValidImages = useCallback((files: File[]): File[] => {
    const valid = files.filter(f => ACCEPTED_TYPES.includes(f.type));
    const rejected = files.length - valid.length;
    if (rejected > 0) {
      toast.error(`${rejected} archivo${rejected > 1 ? 's' : ''} rechazado${rejected > 1 ? 's' : ''} (solo .jpg, .png, .webp)`);
    }
    return valid;
  }, []);

  // Multi-photo upload via input
  const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = filterValidImages(Array.from(e.target.files));
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  // Drag & Drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounterRef.current = 0;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = filterValidImages(Array.from(e.dataTransfer.files));
      if (droppedFiles.length > 0) {
        setSelectedFiles(prev => [...prev, ...droppedFiles]);
      }
      e.dataTransfer.clearData();
    }
  }, [filterValidImages]);

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleMultiUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Selecciona al menos una imagen.');
      return;
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      selectedFiles.forEach(file => formData.append('files', file));
      await addMultipleAction(formData);
      toast.success(`${selectedFiles.length} imagen${selectedFiles.length > 1 ? 'es' : ''} subida${selectedFiles.length > 1 ? 's' : ''}`);
      setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      router.refresh();
    } catch (error) {
      toast.error('Error al subir las imágenes');
    } finally {
      setIsUploading(false);
    }
  };

  // Single video
  const handleVideoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    const formData = new FormData(e.currentTarget);
    formData.append('tipo', 'video');
    try {
      await addSingleAction(formData);
      toast.success('Video añadido');
      (e.target as HTMLFormElement).reset();
      router.refresh();
    } catch (error) {
      toast.error('Error al guardar el video');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Tab selector */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode('fotos')}
          className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
            mode === 'fotos'
              ? 'bg-azul-acropolis text-white shadow-md'
              : 'bg-white text-gris-texto shadow-sm hover:bg-gray-50'
          }`}
        >
          <ImagePlus size={18} />
          Subir Fotos
        </button>
        <button
          type="button"
          onClick={() => setMode('video')}
          className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
            mode === 'video'
              ? 'bg-azul-acropolis text-white shadow-md'
              : 'bg-white text-gris-texto shadow-sm hover:bg-gray-50'
          }`}
        >
          <Film size={18} />
          Agregar Video
        </button>
      </div>

      {/* ============ MODO FOTOS (Multi-Upload) ============ */}
      {mode === 'fotos' && (
        <div className="rounded-2xl bg-white p-6 shadow-[var(--shadow-card)]">
          <h2 className="mb-4 text-lg font-bold text-negro">
            Subir Fotografías
          </h2>
          <p className="mb-4 text-sm text-gris-texto">
            Selecciona una o varias imágenes a la vez, o arrástralas directamente. Formatos: .jpg, .png, .webp
          </p>

          {/* Drop zone with drag & drop support */}
          <label
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 transition-all duration-200 ${
              isDragging
                ? 'border-azul-acropolis bg-azul-soft/30 scale-[1.02] shadow-lg'
                : 'border-gray-300 bg-gray-50/50 hover:border-azul-acropolis hover:bg-azul-soft/20'
            }`}
          >
            <UploadCloud size={40} className={`mb-3 transition-colors duration-200 ${isDragging ? 'text-azul-acropolis' : 'text-gray-400'}`} />
            <span className={`text-sm font-semibold transition-colors duration-200 ${isDragging ? 'text-azul-acropolis' : 'text-negro'}`}>
              {isDragging ? '¡Suelta las imágenes aquí!' : 'Haz clic para seleccionar imágenes'}
            </span>
            <span className="mt-1 text-xs text-gris-texto">
              {isDragging ? '' : 'o arrastra los archivos aquí'}
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleFilesSelect}
              className="hidden"
            />
          </label>

          {/* File preview list */}
          {selectedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-semibold text-negro">
                {selectedFiles.length} archivo{selectedFiles.length > 1 ? 's' : ''} seleccionado{selectedFiles.length > 1 ? 's' : ''}:
              </p>
              <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-2">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="h-12 w-16 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-negro">{file.name}</p>
                      <p className="text-[10px] text-gris-texto">{(file.size / 1024).toFixed(0)} KB</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="rounded-full p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleMultiUpload}
                  disabled={isUploading}
                  className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-azul-acropolis px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-azul-hover disabled:opacity-50"
                >
                  {isUploading ? 'Subiendo...' : `Subir ${selectedFiles.length} foto${selectedFiles.length > 1 ? 's' : ''}`}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============ MODO VIDEO ============ */}
      {mode === 'video' && (
        <div className="rounded-2xl bg-white p-6 shadow-[var(--shadow-card)]">
          <h2 className="mb-4 text-lg font-bold text-negro">
            Agregar Video
          </h2>
          <form onSubmit={handleVideoSubmit} className="space-y-5">
            <div>
              <label htmlFor="videoUrl" className="mb-1.5 block text-sm font-semibold text-negro">
                Enlace del Video <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="videoUrl"
                name="videoUrl"
                required
                placeholder="Ej: https://www.youtube.com/watch?v=abc123"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
              />
              <p className="mt-1 text-xs text-gris-texto">Pega el enlace completo de YouTube o Vimeo.</p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-negro">
                Miniatura del Video (Portada) <span className="text-red-500">*</span>
              </label>
              <p className="mb-2 text-xs text-gris-texto">Sube una imagen que represente visualmente el video en la galería.</p>
              <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-azul-soft text-azul-acropolis">
                  <UploadCloud size={24} />
                </div>
                <input
                  type="file"
                  name="uploadTarget"
                  accept="image/jpeg,image/png,image/webp"
                  required
                  className="block w-full text-sm text-gris-texto file:mr-4 file:rounded-full file:border-0 file:bg-azul-soft file:px-4 file:py-2 file:text-sm file:font-semibold file:text-azul-acropolis hover:file:bg-azul-100 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="caption" className="mb-1.5 block text-sm font-semibold text-negro">
                Descripción (Opcional)
              </label>
              <input
                type="text"
                id="caption"
                name="caption"
                maxLength={150}
                placeholder="Breve descripción del video"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-negro outline-none transition-all focus:border-azul-acropolis focus:ring-2 focus:ring-azul-acropolis/20"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isUploading}
                className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-azul-acropolis px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-azul-hover disabled:opacity-50"
              >
                {isUploading ? 'Guardando...' : 'Añadir Video'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
