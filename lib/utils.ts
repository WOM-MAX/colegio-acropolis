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
  if (!category) return 'bg-gray-100 text-gray-700';

  // Paleta curada "soft/pastel" para categorías
  const palettes = [
    'bg-blue-100 text-blue-800',       // Azul
    'bg-emerald-100 text-emerald-800', // Esmeralda
    'bg-violet-100 text-violet-800',   // Violeta
    'bg-amber-100 text-amber-800',     // Ámbar
    'bg-rose-100 text-rose-800',       // Rosa
    'bg-cyan-100 text-cyan-800',       // Cian
    'bg-fuchsia-100 text-fuchsia-800', // Fucsia
    'bg-indigo-100 text-indigo-800',   // Índigo
  ];

  // Casos principales para mantener consistencia con la identidad visual
  const specialCases: Record<string, string> = {
    'Dirección': palettes[0], // Azul
    'Académico': palettes[5], // Cian
    'Convivencia Escolar': palettes[1], // Esmeralda
    'Convivencia': palettes[1], // Esmeralda
    'Comunidad': palettes[6], // Fucsia
    'Extraescolar': palettes[3], // Ámbar
    'Deportes': palettes[1], // Esmeralda
    'General': 'bg-gray-100 text-gray-700', // Gris neutral para general
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
