/**
 * Genera un slug URL-friendly desde un título
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Elimina acentos
    .replace(/[^a-z0-9\s-]/g, '') // Solo alfanuméricos, espacios y guiones
    .trim()
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/-+/g, '-'); // Elimina guiones duplicados
}

/**
 * Trunca texto a un máximo de caracteres sin cortar palabras
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '…' : truncated + '…';
}

/**
 * Formatea una fecha al estilo chileno (ej: "14 de abril de 2026")
 */
export function formatDateCL(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00'); // Evita problemas de zona horaria
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
  ];
  return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
}

/**
 * Formatea una fecha corta (ej: "14 abr 2026")
 */
export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  const months = [
    'ene', 'feb', 'mar', 'abr', 'may', 'jun',
    'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Clase CSS condicional (utilidad tipo clsx simplificada)
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Asigna un color consistente de una paleta predefinida a una categoría usando un hash determinista.
 * Ideal para etiquetas (badges) en el CMS que requieren variedad sin perder la elegancia.
 */
export function getCategoryColor(category: string): string {
  if (!category) return 'bg-slate-100 text-slate-800 border border-slate-200 font-bold';

  // Paleta curada de alto contraste con bordes nítidos para categorías
  const palettes = [
    'bg-blue-50 text-blue-900 border border-blue-200 font-bold',         // Azul
    'bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold', // Esmeralda
    'bg-purple-50 text-purple-900 border border-purple-200 font-bold',   // Violeta
    'bg-amber-50 text-amber-950 border border-amber-300 font-bold',       // Ámbar
    'bg-rose-50 text-rose-900 border border-rose-200 font-bold',         // Rosa
    'bg-cyan-50 text-cyan-950 border border-cyan-300 font-bold',         // Cian
    'bg-fuchsia-50 text-fuchsia-950 border border-fuchsia-300 font-bold', // Fucsia
    'bg-indigo-50 text-indigo-900 border border-indigo-200 font-bold',   // Índigo
  ];

  // Casos principales para mantener consistencia con la identidad visual
  const specialCases: Record<string, string> = {
    'Dirección': 'bg-blue-50 text-blue-900 border border-blue-200 font-bold',
    'Académico': 'bg-cyan-50 text-cyan-950 border border-cyan-300 font-bold',
    'Convivencia Escolar': 'bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold',
    'Convivencia': 'bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold',
    'Institucional': 'bg-indigo-50 text-indigo-950 border border-indigo-200 font-bold',
    'Comunidad': 'bg-fuchsia-50 text-fuchsia-950 border border-fuchsia-300 font-bold',
    'Extraescolar': 'bg-amber-50 text-amber-950 border border-amber-300 font-bold',
    'Deportes': 'bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold',
    'General': 'bg-slate-100 text-slate-900 border border-slate-200 font-bold',
  };

  if (specialCases[category]) {
    return specialCases[category];
  }

  // Hash simple para cualquier otra categoría
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Asegurar que el hash sea positivo para acceder al array
  const positiveHash = Math.abs(hash);
  const index = positiveHash % palettes.length;

  return palettes[index];
}
