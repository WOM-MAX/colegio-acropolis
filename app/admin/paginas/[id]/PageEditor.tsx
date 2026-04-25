'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { addSeccion, updateSeccionConfig, deleteSeccion, updateOrdenSecciones, updateSeccionActiva, updatePaginaSeo } from './actions';
import { updatePaginaStatus } from '../actions';
import { Plus, Trash2, Edit3, ArrowUp, ArrowDown, Layout, Type, Image as ImageIcon, Eye, EyeOff, Settings, Save, Globe, Lock } from 'lucide-react';
import BlockFormModal from './BlockFormModal';

type Seccion = {
  id: number;
  paginaId: number;
  tipoBloque: string;
  orden: number;
  configuracion: any;
  estadoActivo?: boolean;
};

export default function PageEditor({ pagina, initialSecciones }: { pagina: any, initialSecciones: Seccion[] }) {
  const [secciones, setSecciones] = useState<Seccion[]>(initialSecciones);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSeccion, setEditingSeccion] = useState<Seccion | null>(null);
  const [isActive, setIsActive] = useState(pagina.activo);
  const [togglingStatus, setTogglingStatus] = useState(false);
  
  // SEO State
  const [showSeoPanel, setShowSeoPanel] = useState(false);
  const [seoTitle, setSeoTitle] = useState(pagina.titulo || '');
  const [seoDescription, setSeoDescription] = useState(pagina.seoDescription || '');
  const [savingSeo, setSavingSeo] = useState(false);

  const handleSaveSeo = async () => {
    setSavingSeo(true);
    const res = await updatePaginaSeo(pagina.id, seoTitle, seoDescription);
    if (res.success) {
      toast.success('Metadatos SEO guardados');
      setShowSeoPanel(false);
    } else {
      toast.error(res.error || 'Error al guardar SEO');
    }
    setSavingSeo(false);
  };

  const handleToggleStatus = async () => {
    setTogglingStatus(true);
    const newStatus = !isActive;
    const res = await updatePaginaStatus(pagina.id, newStatus);
    if (res.success) {
      setIsActive(newStatus);
      toast.success(newStatus ? 'Página publicada' : 'Página movida a borrador');
    } else {
      toast.error('Error al cambiar el estado de la página');
    }
    setTogglingStatus(false);
  };

  // Reordenar
  const moveReorder = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === secciones.length - 1) return;

    const newLista = [...secciones];
    const item = newLista[index];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    newLista[index] = newLista[swapIndex];
    newLista[swapIndex] = item;

    // Recalcular orden
    const ordered = newLista.map((s, i) => ({ ...s, orden: i }));
    setSecciones(ordered);

    // Save async
    await updateOrdenSecciones(ordered.map(s => ({ id: s.id, orden: s.orden })));
    toast.success('Orden actualizado');
  };

  const handleAdd = () => {
    setEditingSeccion(null);
    setIsModalOpen(true);
  };

  const handleEdit = (seccion: Seccion) => {
    setEditingSeccion(seccion);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este bloque?')) return;
    
    setLoading(true);
    const res = await deleteSeccion(id);
    if (res.success) {
      setSecciones(secciones.filter(s => s.id !== id));
      toast.success('Bloque eliminado');
    } else {
      toast.error(res.error || 'Error al eliminar');
    }
    setLoading(false);
  };

  const handleSaveModal = async (tipoBloque: string, configuracion: any) => {
    setLoading(true);
    if (editingSeccion) {
      // Update
      const res = await updateSeccionConfig(editingSeccion.id, configuracion);
      if (res.success) {
        setSecciones(secciones.map(s => s.id === editingSeccion.id ? { ...s, configuracion } : s));
        toast.success('Configuración guardada');
      } else {
        toast.error(res.error || 'Error al guardar');
      }
    } else {
      // Create
      const nuevoOrden = secciones.length > 0 ? Math.max(...secciones.map(s => s.orden)) + 1 : 0;
      const res = await addSeccion(pagina.id, tipoBloque, nuevoOrden, configuracion);
      if (res.success && res.data) {
        setSecciones([...secciones, res.data as Seccion]);
        toast.success('Nuevo bloque añadido');
      } else {
        toast.error(res.error || 'Error al crear bloque');
      }
    }
    setLoading(false);
    setIsModalOpen(false);
  };

  const getIconForType = (tipo: string) => {
    switch (tipo) {
      case 'HERO': return <Layout size={20} className="text-azul-acropolis" />;
      case 'TEXTO': return <Type size={20} className="text-fucsia" />;
      default: return <Layout size={20} />;
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Botones Superiores */}
      <div className="flex justify-end gap-3 mb-2 flex-wrap">
        <button
          onClick={handleToggleStatus}
          disabled={togglingStatus}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 ${isActive ? 'bg-green-50 text-green-600 border border-green-200 hover:bg-green-100' : 'bg-gray-100 text-gris-texto border border-gray-200 hover:bg-gray-200'}`}
        >
          {isActive ? <Globe size={16} /> : <Lock size={16} />}
          {isActive ? 'Página Pública' : 'Modo Borrador'}
        </button>

        <button
          onClick={() => setShowSeoPanel(!showSeoPanel)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${showSeoPanel ? 'bg-azul-acropolis text-white' : 'bg-white border border-gray-200 text-gris-texto hover:bg-gray-50'}`}
        >
          <Settings size={16} />
          {showSeoPanel ? 'Ocultar SEO' : 'Configurar SEO de la Página'}
        </button>
      </div>

      {/* SEO Panel */}
      {showSeoPanel && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-bold text-negro mb-4">Metadatos y SEO</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-negro mb-1">Título de la Página (Meta Title)</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-azul-acropolis/50 focus:border-azul-acropolis"
                placeholder="Ej: Nuestra Historia | Colegio Acrópolis"
              />
              <p className="text-xs text-gris-texto mt-1">Este es el título que aparecerá en la pestaña del navegador y en los resultados de Google.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-negro mb-1">Descripción Breve (Meta Description)</label>
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                rows={3}
                className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-azul-acropolis/50 focus:border-azul-acropolis"
                placeholder="Ej: Conoce la historia y trayectoria de más de 30 años de excelencia educativa del Colegio Acrópolis..."
              />
              <p className="text-xs text-gris-texto mt-1">Descripción corta (aprox. 150-160 caracteres) ideal para redes sociales y buscadores.</p>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveSeo}
                disabled={savingSeo}
                className="flex items-center gap-2 bg-azul-acropolis text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow hover:bg-azul-hover transition-colors disabled:opacity-50"
              >
                <Save size={16} />
                {savingSeo ? 'Guardando...' : 'Guardar SEO'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Secciones */}
      {secciones.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <Type size={32} className="mx-auto mb-3 text-gray-400" />
          <h3 className="text-lg font-bold text-negro">Página Vacía</h3>
          <p className="mt-1 text-sm text-gris-texto">Esta página no tiene bloques de contenido aún.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {secciones.map((seccion, index) => (
            <div key={seccion.id} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-gray-300">
              <div className="flex items-center gap-4">
                {/* Drag arrows */}
                <div className="flex flex-col gap-1">
                  <button onClick={() => moveReorder(index, 'up')} disabled={index === 0} className="text-gray-400 disabled:opacity-30 hover:text-azul-acropolis">
                    <ArrowUp size={16} />
                  </button>
                  <button onClick={() => moveReorder(index, 'down')} disabled={index === secciones.length - 1} className="text-gray-400 disabled:opacity-30 hover:text-azul-acropolis">
                    <ArrowDown size={16} />
                  </button>
                </div>
                
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50">
                  {getIconForType(seccion.tipoBloque)}
                </div>

                <div>
                  <h4 className="font-bold text-negro">{seccion.tipoBloque}</h4>
                  <p className="text-xs text-gris-texto truncate max-w-xs sm:max-w-md">
                    {seccion.configuracion?.titulo || '(Sin título)'}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={async () => {
                    const newVal = seccion.estadoActivo === undefined ? false : !seccion.estadoActivo;
                    const res = await updateSeccionActiva(seccion.id, newVal);
                    if (res.success) {
                      setSecciones(secciones.map(s => s.id === seccion.id ? { ...s, estadoActivo: newVal } : s));
                    }
                  }}
                  className={`rounded-lg p-2 transition-colors ${seccion.estadoActivo === false ? 'text-gray-300 hover:text-gray-500' : 'text-green-600 hover:text-green-700'}`}
                  title={seccion.estadoActivo === false ? 'Bloque oculto' : 'Bloque visible'}
                >
                  <EyeOff size={18} className={seccion.estadoActivo === false ? 'block' : 'hidden'} />
                  <Eye size={18} className={seccion.estadoActivo === false ? 'hidden' : 'block'} />
                </button>
                <button 
                  onClick={() => handleEdit(seccion)}
                  className="rounded-lg p-2 text-gris-texto hover:bg-azul-soft hover:text-azul-acropolis"
                >
                  <Edit3 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(seccion.id)}
                  disabled={loading}
                  className="rounded-lg p-2 text-gris-texto hover:bg-fucsia-soft hover:text-fucsia disabled:opacity-50"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Botón de Añadir */}
      <div className="flex justify-center pt-4">
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-full bg-azul-acropolis px-6 py-3 font-semibold text-white shadow hover:bg-azul-hover transition-colors"
        >
          <Plus size={20} />
          Añadir Nuevo Bloque
        </button>
      </div>

      {isModalOpen && (
        <BlockFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveModal}
          initialData={editingSeccion}
        />
      )}
    </div>
  );
}
