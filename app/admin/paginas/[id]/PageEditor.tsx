'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { 
  addSeccion, 
  updateSeccionConfig, 
  deleteSeccion, 
  updateOrdenSecciones, 
  updateSeccionActiva, 
  updatePaginaSeo,
  inicializarEstructuraInicio
} from './actions';
import { updatePaginaStatus } from '../actions';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  Layout, 
  Type, 
  Image as ImageIcon, 
  Eye, 
  EyeOff, 
  Settings, 
  Save, 
  Globe, 
  Lock,
  Sparkles,
  Calendar,
  Newspaper,
  Download,
  GraduationCap,
  Tv,
  AlertTriangle,
  Film,
  Grid,
  Users,
  BarChart,
  MapPin,
  HelpCircle,
  MousePointerClick,
  Columns
} from 'lucide-react';
import BlockFormModal from './BlockFormModal';

type Seccion = {
  id: number;
  paginaId: number;
  tipoBloque: string;
  orden: number;
  configuracion: any;
  estadoActivo?: boolean;
};

export default function PageEditor({ pagina, initialSecciones }: { pagina: any; initialSecciones: Seccion[] }) {
  const [secciones, setSecciones] = useState<Seccion[]>(initialSecciones);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSeccion, setEditingSeccion] = useState<Seccion | null>(null);
  const [insertIndex, setInsertIndex] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(pagina.activo);
  const [togglingStatus, setTogglingStatus] = useState(false);
  const [initializingHome, setInitializingHome] = useState(false);

  const isHomePage = pagina.slug === '/' || pagina.slug === '';
  const tieneModulosHome = secciones.some(s => s.tipoBloque.startsWith('HOME_'));
  
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

  const handleInicializarInicio = async () => {
    if (!confirm('¿Deseas inicializar la estructura institucional en esta página? Esto organizará el Hero, Eventos, Journal, etc. en bloques reordenables.')) return;
    
    setInitializingHome(true);
    const res = await inicializarEstructuraInicio(pagina.id);
    if (res.success && res.data) {
      setSecciones(res.data as Seccion[]);
      toast.success('Estructura institucional cargada correctamente');
    } else {
      toast.error(res.error || 'Error al inicializar la estructura');
    }
    setInitializingHome(false);
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

  const handleAddAt = (index: number | null = null) => {
    setEditingSeccion(null);
    setInsertIndex(index);
    setIsModalOpen(true);
  };

  const handleEdit = (seccion: Seccion) => {
    setEditingSeccion(seccion);
    setInsertIndex(null);
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
      // Create with target insertion index if specified
      const targetOrder = insertIndex !== null ? insertIndex : (secciones.length > 0 ? Math.max(...secciones.map(s => s.orden)) + 1 : 0);
      const res = await addSeccion(pagina.id, tipoBloque, targetOrder, configuracion, insertIndex !== null ? insertIndex : undefined);
      
      if (res.success && res.data) {
        if (insertIndex !== null) {
          // Reconstruir lista local con el nuevo elemento insertado en su posición
          const updated = [...secciones];
          updated.splice(insertIndex, 0, res.data as Seccion);
          const renumbered = updated.map((s, idx) => ({ ...s, orden: idx }));
          setSecciones(renumbered);
        } else {
          setSecciones([...secciones, res.data as Seccion]);
        }
        toast.success('Nuevo bloque añadido');
      } else {
        toast.error(res.error || 'Error al crear bloque');
      }
    }
    setLoading(false);
    setIsModalOpen(false);
  };

  const getBlockMeta = (tipo: string) => {
    switch (tipo) {
      case 'HOME_HERO':
        return { label: 'Hero Principal (Frente)', icon: <Sparkles size={18} className="text-amarillo-oscuro" />, isSystem: true };
      case 'HOME_EVENTOS':
        return { label: 'Carrusel de Eventos', icon: <Calendar size={18} className="text-fucsia" />, isSystem: true };
      case 'HOME_JOURNAL':
        return { label: 'Noticias (Journal Institucional)', icon: <Newspaper size={18} className="text-azul-acropolis" />, isSystem: true };
      case 'HOME_CALENDARIOS':
        return { label: 'Calendarios de Evaluaciones', icon: <Calendar size={18} className="text-cyan-600" />, isSystem: true };
      case 'HOME_DESCARGAS':
        return { label: 'Zona de Descargas Rápidas', icon: <Download size={18} className="text-amber-600" />, isSystem: true };
      case 'HOME_BANNER_CTA':
        return { label: 'Banner de Admisión / CTA', icon: <GraduationCap size={18} className="text-fucsia" />, isSystem: true };
      case 'CINTA_NOTICIAS':
        return { label: 'Cinta de Noticias (Ticker)', icon: <Tv size={18} className="text-fucsia" />, isSystem: false };
      case 'ALERTA':
        return { label: 'Cintillo de Alerta', icon: <AlertTriangle size={18} className="text-amber-500" />, isSystem: false };
      case 'HERO':
        return { label: 'Cabecera Hero Personalizada', icon: <Layout size={18} className="text-azul-acropolis" />, isSystem: false };
      case 'IMAGEN_TEXTO':
        return { label: 'Imagen y Texto', icon: <Columns size={18} className="text-emerald-600" />, isSystem: false };
      case 'TEXTO':
        return { label: 'Bloque de Texto Enrich', icon: <Type size={18} className="text-indigo-600" />, isSystem: false };
      case 'TARJETAS':
        return { label: 'Grilla de Tarjetas', icon: <Grid size={18} className="text-blue-600" />, isSystem: false };
      case 'ACORDEON':
        return { label: 'Acordeón de Contenido', icon: <HelpCircle size={18} className="text-purple-600" />, isSystem: false };
      case 'CTA_BOTONES':
        return { label: 'Llamado a la Acción (Botones)', icon: <MousePointerClick size={18} className="text-rose-600" />, isSystem: false };
      case 'VIDEO':
        return { label: 'Video Integrado', icon: <Film size={18} className="text-red-500" />, isSystem: false };
      case 'EQUIPO':
        return { label: 'Perfiles de Equipo', icon: <Users size={18} className="text-teal-600" />, isSystem: false };
      case 'ESTADISTICAS':
        return { label: 'Métricas y Estadísticas', icon: <BarChart size={18} className="text-blue-500" />, isSystem: false };
      case 'CONTACTO_INFO':
        return { label: 'Información de Contacto', icon: <MapPin size={18} className="text-orange-500" />, isSystem: false };
      default:
        return { label: tipo, icon: <Layout size={18} className="text-gray-500" />, isSystem: false };
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Botones Superiores */}
      <div className="flex justify-between items-center gap-3 mb-2 flex-wrap">
        <div>
          {isHomePage && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <Sparkles size={13} /> Página de Inicio Principal (/)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isHomePage && (
            <button
              onClick={handleInicializarInicio}
              disabled={initializingHome}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-colors disabled:opacity-50"
              title="Carga o restablece las secciones del sistema (Hero, Eventos, Journal, etc.) para que puedas intercalar bloques en cualquier posición"
            >
              <Sparkles size={14} />
              {initializingHome ? 'Cargando...' : 'Restablecer Estructura Inicio'}
            </button>
          )}

          <button
            onClick={handleToggleStatus}
            disabled={togglingStatus}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${isActive ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100' : 'bg-gray-100 text-gris-texto border border-gray-200 hover:bg-gray-200'}`}
          >
            {isActive ? <Globe size={14} /> : <Lock size={14} />}
            {isActive ? 'Página Pública' : 'Modo Borrador'}
          </button>

          <button
            onClick={() => setShowSeoPanel(!showSeoPanel)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${showSeoPanel ? 'bg-azul-acropolis text-white' : 'bg-white border border-gray-200 text-gris-texto hover:bg-gray-50'}`}
          >
            <Settings size={14} />
            {showSeoPanel ? 'Ocultar SEO' : 'Configurar SEO'}
          </button>
        </div>
      </div>

      {/* Banner de Ayuda para la Página de Inicio si no tiene módulos nativos */}
      {isHomePage && !tieneModulosHome && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-bold text-amber-900 text-sm flex items-center gap-2">
                <Sparkles size={16} className="text-amber-600" />
                Intercalar bloques en cualquier lugar del Inicio
              </h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                Actualmente tu inicio usa el orden básico por defecto. Puedes cargar la estructura completa para ubicar bloques personalizados antes, entre o después de cualquier sección institucional (Hero, Eventos, Journal, etc.).
              </p>
            </div>
            <button
              onClick={handleInicializarInicio}
              disabled={initializingHome}
              className="shrink-0 flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow transition-colors disabled:opacity-50"
            >
              <Sparkles size={14} />
              {initializingHome ? 'Cargando...' : 'Cargar Secciones del Inicio'}
            </button>
          </div>
        </div>
      )}

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
        <div className="space-y-3">
          {/* Botón para insertar arriba del primer bloque */}
          <div className="flex justify-center -mb-1">
            <button
              onClick={() => handleAddAt(0)}
              className="group flex items-center gap-1.5 px-3 py-1 rounded-full border border-dashed border-gray-300 bg-gray-50/80 hover:bg-azul-soft hover:border-azul-acropolis text-[11px] font-semibold text-gris-texto hover:text-azul-acropolis transition-all shadow-2xs"
            >
              <Plus size={12} className="transition-transform group-hover:scale-110" />
              <span>Insertar bloque al inicio</span>
            </button>
          </div>

          {secciones.map((seccion, index) => {
            const meta = getBlockMeta(seccion.tipoBloque);

            return (
              <div key={seccion.id} className="space-y-3">
                <div className={`flex items-center justify-between rounded-xl border p-4 shadow-2xs transition-all ${
                  seccion.estadoActivo === false 
                    ? 'border-gray-200 bg-gray-50/70 opacity-75' 
                    : meta.isSystem 
                      ? 'border-amber-200 bg-amber-50/30 hover:border-amber-300' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                }`}>
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    {/* Flechas de reordenamiento */}
                    <div className="flex flex-col gap-1 shrink-0">
                      <button 
                        onClick={() => moveReorder(index, 'up')} 
                        disabled={index === 0} 
                        className="p-1 text-gray-400 disabled:opacity-20 hover:text-azul-acropolis transition-colors rounded hover:bg-gray-100"
                        title="Subir posición"
                      >
                        <ArrowUp size={15} />
                      </button>
                      <button 
                        onClick={() => moveReorder(index, 'down')} 
                        disabled={index === secciones.length - 1} 
                        className="p-1 text-gray-400 disabled:opacity-20 hover:text-azul-acropolis transition-colors rounded hover:bg-gray-100"
                        title="Bajar posición"
                      >
                        <ArrowDown size={15} />
                      </button>
                    </div>

                    {/* Número de Orden */}
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[11px] font-bold text-gray-600">
                      {index + 1}
                    </span>
                    
                    {/* Icono del tipo de bloque */}
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      meta.isSystem ? 'bg-amber-100/70' : 'bg-gray-100'
                    }`}>
                      {meta.icon}
                    </div>

                    {/* Información del Bloque */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-negro truncate">{meta.label}</h4>
                        {meta.isSystem ? (
                          <span className="rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider shrink-0">
                            ⚡ Sistema Nativo
                          </span>
                        ) : (
                          <span className="rounded-full bg-blue-50 text-azul-acropolis text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider shrink-0">
                            Bloque CMS
                          </span>
                        )}
                        {seccion.estadoActivo === false && (
                          <span className="rounded-full bg-gray-200 text-gray-600 text-[10px] font-semibold px-2 py-0.5 shrink-0">
                            Oculto
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gris-texto truncate mt-0.5">
                        {seccion.configuracion?.titulo || seccion.configuracion?.title || '(Configuración activa)'}
                      </p>
                    </div>
                  </div>

                  {/* Acciones del Bloque */}
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button 
                      onClick={async () => {
                        const newVal = seccion.estadoActivo === undefined ? false : !seccion.estadoActivo;
                        const res = await updateSeccionActiva(seccion.id, newVal);
                        if (res.success) {
                          setSecciones(secciones.map(s => s.id === seccion.id ? { ...s, estadoActivo: newVal } : s));
                          toast.success(newVal ? 'Bloque visible' : 'Bloque ocultado');
                        }
                      }}
                      className={`rounded-lg p-2 transition-colors ${seccion.estadoActivo === false ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100' : 'text-green-600 hover:text-green-700 hover:bg-green-50'}`}
                      title={seccion.estadoActivo === false ? 'Bloque oculto (haz clic para mostrar)' : 'Bloque visible (haz clic para ocultar)'}
                    >
                      {seccion.estadoActivo === false ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>

                    <button 
                      onClick={() => handleEdit(seccion)}
                      className="rounded-lg p-2 text-gris-texto hover:bg-azul-soft hover:text-azul-acropolis transition-colors"
                      title="Editar contenido / configuración"
                    >
                      <Edit3 size={17} />
                    </button>

                    <button 
                      onClick={() => handleDelete(seccion.id)}
                      disabled={loading}
                      className="rounded-lg p-2 text-gris-texto hover:bg-red-50 hover:text-red-600 disabled:opacity-50 transition-colors"
                      title="Eliminar bloque"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                {/* Botón para insertar entre este bloque y el siguiente */}
                {index < secciones.length - 1 && (
                  <div className="relative flex items-center justify-center py-1">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-dashed border-gray-200"></div>
                    </div>
                    <button
                      onClick={() => handleAddAt(index + 1)}
                      className="group relative z-10 flex items-center gap-1 px-3 py-1 rounded-full border border-dashed border-gray-300 bg-white hover:bg-azul-soft hover:border-azul-acropolis text-[11px] font-semibold text-gris-texto hover:text-azul-acropolis transition-all shadow-2xs"
                      title={`Insertar nuevo bloque entre la posición ${index + 1} y ${index + 2}`}
                    >
                      <Plus size={12} className="transition-transform group-hover:scale-110" />
                      <span>Insertar bloque aquí</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Botón de Añadir al Final */}
      <div className="flex justify-center pt-4">
        <button 
          onClick={() => handleAddAt(null)}
          className="flex items-center gap-2 rounded-full bg-azul-acropolis px-6 py-3 font-semibold text-white shadow-md hover:bg-azul-hover transition-colors text-sm"
        >
          <Plus size={18} />
          Añadir Bloque al Final
        </button>
      </div>

      {isModalOpen && (
        <BlockFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setInsertIndex(null);
          }}
          onSave={handleSaveModal}
          initialData={editingSeccion}
        />
      )}
    </div>
  );
}

