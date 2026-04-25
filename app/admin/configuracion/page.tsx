'use client';

import { useState, useEffect, useTransition } from 'react';
import { toast } from 'react-hot-toast';
import {
  Save, Plus, Trash2, GripVertical,
  Phone, MessageCircle,
  Globe, ChevronDown, ChevronUp, Settings2, Share2, Mail, MapPin,
} from 'lucide-react';
import { getConfiguracion, saveConfiguracion, type SiteConfig, type RedSocial, type Telefono, type Email } from './actions';
import { SocialIcon } from '@/components/layout/Header';

const PLATAFORMAS = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'twitter', label: 'X / Twitter' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'otra', label: 'Otra' },
];

const TIPOS_TEL = [
  { value: 'fijo', label: '📞 Fijo' },
  { value: 'celular', label: '📱 Celular' },
  { value: 'whatsapp', label: '💬 WhatsApp' },
];

const VISIBILIDAD = [
  { value: 'ambos', label: 'Header y Footer' },
  { value: 'header', label: 'Solo Header' },
  { value: 'footer', label: 'Solo Footer' },
];

const Section = ({
  title,
  subtitle,
  icon: Icon,
  isOpen,
  onToggle,
  count,
  accentColor,
  children,
}: {
  title: string;
  subtitle: string;
  icon: any;
  isOpen: boolean;
  onToggle: () => void;
  count: number;
  accentColor: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between px-6 py-5 text-left hover:bg-gray-50/50 transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accentColor}`}>
          <Icon size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-negro">{title}</h2>
          <p className="text-sm text-gris-texto">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {count > 0 && (
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-gray-100 px-2 text-xs font-bold text-gris-texto">
            {count}
          </span>
        )}
        {isOpen ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
      </div>
    </button>
    {isOpen && <div className="border-t border-gray-100 px-6 py-5">{children}</div>}
  </div>
);

export default function ConfiguracionPage() {
  const [config, setConfig] = useState<SiteConfig>({
    redesSociales: [],
    telefonos: [],
    emails: [],
    direccion: '',
    mapaEmbedUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [openSections, setOpenSections] = useState({
    redes: true,
    telefonos: true,
    emails: true,
    ubicacion: false,
  });

  useEffect(() => {
    getConfiguracion().then((data) => {
      setConfig(data);
      setLoading(false);
    });
  }, []);

  const toggleSection = (key: keyof typeof openSections) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  // ── Redes Sociales ───────────────────────────────────────
  const addRed = () => {
    setConfig((prev) => ({
      ...prev,
      redesSociales: [
        ...prev.redesSociales,
        { plataforma: 'facebook', url: '', mostrarEn: 'ambos' as const, orden: prev.redesSociales.length },
      ],
    }));
  };

  const updateRed = (index: number, field: keyof RedSocial, value: any) => {
    setConfig((prev) => {
      const copy = [...prev.redesSociales];
      copy[index] = { ...copy[index], [field]: value };
      return { ...prev, redesSociales: copy };
    });
  };

  const removeRed = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      redesSociales: prev.redesSociales.filter((_, i) => i !== index),
    }));
  };

  // ── Teléfonos ────────────────────────────────────────────
  const addTelefono = () => {
    setConfig((prev) => ({
      ...prev,
      telefonos: [...prev.telefonos, { etiqueta: '', numero: '', tipo: 'fijo' as const }],
    }));
  };

  const updateTelefono = (index: number, field: keyof Telefono, value: string) => {
    setConfig((prev) => {
      const copy = [...prev.telefonos];
      copy[index] = { ...copy[index], [field]: value };
      return { ...prev, telefonos: copy };
    });
  };

  const removeTelefono = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      telefonos: prev.telefonos.filter((_, i) => i !== index),
    }));
  };

  // ── Emails ───────────────────────────────────────────────
  const addEmail = () => {
    setConfig((prev) => ({
      ...prev,
      emails: [...prev.emails, { etiqueta: '', email: '' }],
    }));
  };

  const updateEmail = (index: number, field: keyof Email, value: string) => {
    setConfig((prev) => {
      const copy = [...prev.emails];
      copy[index] = { ...copy[index], [field]: value };
      return { ...prev, emails: copy };
    });
  };

  const removeEmail = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      emails: prev.emails.filter((_, i) => i !== index),
    }));
  };

  // ── Save ─────────────────────────────────────────────────
  const handleSave = () => {
    startTransition(async () => {
      const result = await saveConfiguracion(config);
      if (result.success) {
        toast.success('Configuración guardada correctamente');
      } else {
        toast.error(result.error || 'Error al guardar');
      }
    });
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="h-10 w-64 skeleton" />
        <div className="h-40 skeleton" />
        <div className="h-40 skeleton" />
      </div>
    );
  }


  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-negro flex items-center gap-3">
            <Settings2 size={28} className="text-azul-acropolis" />
            Configuración del Sitio
          </h1>
          <p className="mt-1 text-sm text-gris-texto">
            Redes sociales, teléfonos y datos de contacto que aparecen en el Header y Footer
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center gap-2 rounded-xl bg-azul-acropolis px-5 py-3 font-semibold text-white shadow-md transition-all hover:bg-azul-hover hover:shadow-lg disabled:opacity-50"
        >
          <Save size={18} />
          {isPending ? 'Guardando…' : 'Guardar Todo'}
        </button>
      </div>

      {/* ═══ REDES SOCIALES ═══ */}
      <Section
        title="Redes Sociales"
        subtitle="Aparecen como iconos en el Header y Footer del sitio"
        icon={Share2}
        isOpen={openSections.redes}
        onToggle={() => toggleSection('redes')}
        count={config.redesSociales.length}
        accentColor="bg-azul-acropolis"
      >
        {config.redesSociales.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-gray-200 py-10 text-center">
            <Share2 size={32} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm text-gray-400">No hay redes sociales configuradas</p>
          </div>
        ) : (
          <div className="space-y-3">
            {config.redesSociales.map((red, i) => {
              return (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white border border-gray-200 mt-1 text-azul-acropolis">
                    <SocialIcon platform={red.plataforma} size={18} />
                  </div>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <select
                      value={red.plataforma}
                      onChange={(e) => updateRed(i, 'plataforma', e.target.value)}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-azul-acropolis focus:outline-none"
                    >
                      {PLATAFORMAS.map((p) => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                    <input
                      type="url"
                      value={red.url}
                      onChange={(e) => updateRed(i, 'url', e.target.value)}
                      placeholder="https://..."
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-azul-acropolis focus:outline-none sm:col-span-1"
                    />
                    <select
                      value={red.mostrarEn}
                      onChange={(e) => updateRed(i, 'mostrarEn', e.target.value)}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-azul-acropolis focus:outline-none"
                    >
                      {VISIBILIDAD.map((v) => (
                        <option key={v.value} value={v.value}>{v.label}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeRed(i)}
                    className="shrink-0 rounded-lg p-2 text-gray-400 hover:bg-fucsia-soft hover:text-fucsia transition-colors mt-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
        <button
          type="button"
          onClick={addRed}
          className="mt-4 flex items-center gap-2 rounded-lg bg-azul-acropolis/10 px-4 py-2 text-sm font-medium text-azul-acropolis hover:bg-azul-acropolis/20 transition-colors"
        >
          <Plus size={16} /> Agregar Red Social
        </button>
      </Section>

      {/* ═══ TELÉFONOS ═══ */}
      <Section
        title="Teléfonos"
        subtitle="Números de contacto del colegio (secretaría, emergencias, WhatsApp)"
        icon={Phone}
        isOpen={openSections.telefonos}
        onToggle={() => toggleSection('telefonos')}
        count={config.telefonos.length}
        accentColor="bg-cian"
      >
        {config.telefonos.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-gray-200 py-10 text-center">
            <Phone size={32} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm text-gray-400">No hay teléfonos configurados</p>
          </div>
        ) : (
          <div className="space-y-3">
            {config.telefonos.map((tel, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={tel.etiqueta}
                    onChange={(e) => updateTelefono(i, 'etiqueta', e.target.value)}
                    placeholder="Ej: Secretaría"
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-cian focus:outline-none"
                  />
                  <input
                    type="text"
                    value={tel.numero}
                    onChange={(e) => updateTelefono(i, 'numero', e.target.value)}
                    placeholder="+56 2 2269 1234"
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-cian focus:outline-none"
                  />
                  <select
                    value={tel.tipo}
                    onChange={(e) => updateTelefono(i, 'tipo', e.target.value)}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-cian focus:outline-none"
                  >
                    {TIPOS_TEL.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => removeTelefono(i)}
                  className="shrink-0 rounded-lg p-2 text-gray-400 hover:bg-fucsia-soft hover:text-fucsia transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={addTelefono}
          className="mt-4 flex items-center gap-2 rounded-lg bg-cian/10 px-4 py-2 text-sm font-medium text-cian-hover hover:bg-cian/20 transition-colors"
        >
          <Plus size={16} /> Agregar Teléfono
        </button>
      </Section>

      {/* ═══ CORREOS ELECTRÓNICOS ═══ */}
      <Section
        title="Correos Electrónicos"
        subtitle="Emails públicos que aparecen en el Header y Footer"
        icon={Mail}
        isOpen={openSections.emails}
        onToggle={() => toggleSection('emails')}
        count={config.emails.length}
        accentColor="bg-fucsia"
      >
        {config.emails.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-gray-200 py-10 text-center">
            <Mail size={32} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm text-gray-400">No hay correos electrónicos configurados</p>
          </div>
        ) : (
          <div className="space-y-3">
            {config.emails.map((em, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={em.etiqueta}
                    onChange={(e) => updateEmail(i, 'etiqueta', e.target.value)}
                    placeholder="Ej: Contacto General"
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-fucsia focus:outline-none"
                  />
                  <input
                    type="email"
                    value={em.email}
                    onChange={(e) => updateEmail(i, 'email', e.target.value)}
                    placeholder="contacto@colegioacropolis.net"
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-fucsia focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeEmail(i)}
                  className="shrink-0 rounded-lg p-2 text-gray-400 hover:bg-fucsia-soft hover:text-fucsia transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={addEmail}
          className="mt-4 flex items-center gap-2 rounded-lg bg-fucsia/10 px-4 py-2 text-sm font-medium text-fucsia hover:bg-fucsia/20 transition-colors"
        >
          <Plus size={16} /> Agregar Correo
        </button>
      </Section>

      {/* ═══ UBICACIÓN ═══ */}
      <Section
        title="Ubicación y Dirección"
        subtitle="Dirección física y mapa embebido del Footer"
        icon={MapPin}
        isOpen={openSections.ubicacion}
        onToggle={() => toggleSection('ubicacion')}
        count={0}
        accentColor="bg-amarillo"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-negro">Dirección Física</label>
            <textarea
              rows={2}
              value={config.direccion}
              onChange={(e) => setConfig({ ...config, direccion: e.target.value })}
              placeholder="Puente Alto, Santiago, Chile"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amarillo focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-negro">URL o IFRAME de Google Maps</label>
            <p className="text-xs text-fucsia mb-1 font-semibold">IMPORTANTE: Abre Google Maps → Compartir → "Insertar un mapa" y pega el HTML aquí.</p>
            <textarea
              rows={3}
              value={config.mapaEmbedUrl}
              onChange={(e) => setConfig({ ...config, mapaEmbedUrl: e.target.value })}
              placeholder='<iframe src="https://www.google.com/maps/embed?..." ...>'
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amarillo focus:outline-none"
            />
          </div>
        </div>
      </Section>

      {/* Botón guardar sticky abajo */}
      <div className="sticky bottom-4 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center gap-2 rounded-xl bg-azul-acropolis px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-azul-hover hover:shadow-xl disabled:opacity-50"
        >
          <Save size={18} />
          {isPending ? 'Guardando…' : 'Guardar Configuración'}
        </button>
      </div>
    </div>
  );
}
