import {
  pgTable,
  serial,
  text,
  varchar,
  boolean,
  timestamp,
  integer,
  date,
  jsonb,
} from 'drizzle-orm/pg-core';

// ============================================================
// TABLA: admin_users
// Usuarios administradores del dashboard
// ============================================================
export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================
// TABLA: journal_categorias
// Categorías dinámicas para el Journal
// ============================================================
export const journalCategorias = pgTable('journal_categorias', {
  id: serial('id').primaryKey(),
  nombre: varchar('nombre', { length: 100 }).notNull(),
  orden: integer('orden').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================
// TABLA: journal_autores
// Autores dinámicos para el Journal
// ============================================================
export const journalAutores = pgTable('journal_autores', {
  id: serial('id').primaryKey(),
  nombre: varchar('nombre', { length: 100 }).notNull(),
  cargo: varchar('cargo', { length: 100 }).notNull(),
  correoInstitucional: varchar('correo_institucional', { length: 255 }),
  fotoUrl: text('foto_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================
// TABLA: journal
// Noticias y artículos del colegio
// ============================================================
export const journal = pgTable('journal', {
  id: serial('id').primaryKey(),
  titulo: varchar('titulo', { length: 120 }).notNull(),
  slug: varchar('slug', { length: 150 }).notNull().unique(),
  categoriaId: integer('categoria_id').references(() => journalCategorias.id),
  autorId: integer('autor_id').references(() => journalAutores.id),
  extracto: varchar('extracto', { length: 200 }).notNull(),
  contenido: text('contenido').notNull(),
  imagenUrl: text('imagen_url'),
  publicado: boolean('publicado').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================
// TABLA: coordinaciones
// Unidades de coordinación del colegio (9 unidades)
// ============================================================
export const coordinaciones = pgTable('coordinaciones', {
  id: serial('id').primaryKey(),
  nombreUnidad: varchar('nombre_unidad', { length: 100 }).notNull(),
  encargada: varchar('encargada', { length: 100 }).notNull(),
  tituloProfesional: varchar('titulo_profesional', { length: 150 }), // Nuevo campo
  correoInstitucional: varchar('correo_institucional', { length: 255 }),
  fotoUrl: text('foto_url'),
  funciones: text('funciones').notNull(),
  resenaProfesional: text('resena_profesional'), // Nuevo campo
  orden: integer('orden').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================
// TABLA: eventos
// Eventos del colegio (slider + calendario)
// ============================================================
export const eventos = pgTable('eventos', {
  id: serial('id').primaryKey(),
  nombre: varchar('nombre', { length: 150 }).notNull(),
  fecha: date('fecha').notNull(),
  descripcion: varchar('descripcion', { length: 200 }).notNull(),
  tipo: varchar('tipo', { length: 20 }).default('general').notNull(),
  imagenUrl: text('imagen_url'),
  activo: boolean('activo').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================
// TABLA: descargas_categorias
// Categorías dinámicas para los documentos descargables
// ============================================================
export const descargasCategorias = pgTable('descargas_categorias', {
  id: serial('id').primaryKey(),
  nombre: varchar('nombre', { length: 100 }).notNull(),
  orden: integer('orden').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================
// TABLA: descargas
// Documentos PDF descargables (útiles, horarios, RIE, reglamento)
// ============================================================
export const descargas = pgTable('descargas', {
  id: serial('id').primaryKey(),
  nombre: varchar('nombre', { length: 100 }).notNull(),
  categoria: varchar('categoria', { length: 50 }).notNull(),
  archivoUrl: text('archivo_url').notNull(),
  version: varchar('version', { length: 20 }),
  imagenUrl: text('imagen_url'),
  colorAcento: varchar('color_acento', { length: 20 }).default('azul').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================
// TABLA: popups
// Ventanas emergentes para noticias importantes
// ============================================================
export const popups = pgTable('popups', {
  id: serial('id').primaryKey(),
  titulo: varchar('titulo', { length: 80 }).notNull(),
  contenido: text('contenido').notNull(),
  imagenUrl: text('imagen_url'),
  tipo: varchar('tipo', { length: 20 }).notNull(), // 'info' | 'urgente' | 'matricula' | 'evento'
  botonTexto: varchar('boton_texto', { length: 50 }),
  botonUrl: text('boton_url'),
  posicion: varchar('posicion', { length: 50 }).default('inferior-derecha').notNull(),
  estiloImagen: varchar('estilo_imagen', { length: 50 }).default('encabezado').notNull(),
  colorFondo: varchar('color_fondo', { length: 50 }).default('#ffffff').notNull(),
  colorTexto: varchar('color_texto', { length: 50 }).default('#111827').notNull(),
  tamanoTitulo: varchar('tamano_titulo', { length: 20 }).default('md').notNull(),
  fechaInicio: date('fecha_inicio').notNull(),
  fechaFin: date('fecha_fin').notNull(),
  activo: boolean('activo').default(true).notNull(),
  frecuencia: varchar('frecuencia', { length: 20 }).notNull(), // 'siempre' | 'una_vez' | 'una_vez_por_dia'
  prioridad: integer('prioridad').default(5).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================
// TABLA: galeria_albumes
// Álbumes de la galería de imágenes institucional
// ============================================================
export const galeriaAlbumes = pgTable('galeria_albumes', {
  id: serial('id').primaryKey(),
  titulo: varchar('titulo', { length: 100 }).notNull(),
  descripcion: varchar('descripcion', { length: 300 }),
  portadaUrl: text('portada_url'),
  fecha: date('fecha'), // Fecha del evento/álbum para ordenamiento
  orden: integer('orden').default(0).notNull(),
  activo: boolean('activo').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================
// TABLA: galeria_fotos (ahora usado como items de galería: fotos y videos)
// Fotos individuales o videos dentro de un álbum
// ============================================================
export const galeriaFotos = pgTable('galeria_fotos', {
  id: serial('id').primaryKey(),
  albumId: integer('album_id').notNull(),
  tipo: varchar('tipo', { length: 20 }).default('imagen').notNull(), // 'imagen' | 'video'
  imagenUrl: text('imagen_url').notNull(), // Si es video, será la miniatura. Si es imagen, será la foto.
  videoUrl: text('video_url'), // Link del recuso de video (e.g. YouTube)
  caption: varchar('caption', { length: 150 }),
  orden: integer('orden').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================
// TABLA: mensajes_contacto
// Mensajes recibidos del formulario de contacto
// ============================================================
export const mensajesContacto = pgTable('mensajes_contacto', {
  id: serial('id').primaryKey(),
  nombre: varchar('nombre', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  telefono: varchar('telefono', { length: 20 }),
  asunto: varchar('asunto', { length: 50 }).notNull(),
  mensaje: text('mensaje').notNull(),
  leido: boolean('leido').default(false).notNull(),
  respondido: boolean('respondido').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================
// TABLA: matricula_config
// Configuración de períodos de matrícula y enlaces SAE
// ============================================================
export const matriculaConfig = pgTable('matricula_config', {
  id: serial('id').primaryKey(),
  periodoNuevosInicio: date('periodo_nuevos_inicio'),
  periodoNuevosFin: date('periodo_nuevos_fin'),
  periodoAntiguosInicio: date('periodo_antiguos_inicio'),
  periodoAntiguosFin: date('periodo_antiguos_fin'),
  enlaceFormularioNuevos: text('enlace_formulario_nuevos'),
  enlaceFormularioAntiguos: text('enlace_formulario_antiguos'),
  requisitos: jsonb('requisitos'), // Array de strings con requisitos documentales
  mensajesAntiguos: jsonb('mensajes_antiguos').default([]).notNull(), // Array of strings
  mensajesNuevos: jsonb('mensajes_nuevos').default([]).notNull(), // Array of strings
  mensajeInformativo: text('mensaje_informativo'),
  activo: boolean('activo').default(true).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================
// TABLA: centro_padres_directiva
// Directiva del Centro de Padres
// ============================================================
export const centroPadresDirectiva = pgTable('centro_padres_directiva', {
  id: serial('id').primaryKey(),
  nombre: varchar('nombre', { length: 100 }).notNull(),
  cargo: varchar('cargo', { length: 80 }).notNull(),
  fotoUrl: text('foto_url'),
  email: varchar('email', { length: 255 }),
  orden: integer('orden').default(0).notNull(),
  periodo: varchar('periodo', { length: 20 }), // e.g. "2025-2026"
  activo: boolean('activo').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================
// TABLA: centro_padres_proyectos
// Proyectos comunitarios del Centro de Padres
// ============================================================
export const centroPadresProyectos = pgTable('centro_padres_proyectos', {
  id: serial('id').primaryKey(),
  titulo: varchar('titulo', { length: 120 }).notNull(),
  descripcion: text('descripcion').notNull(),
  estado: varchar('estado', { length: 20 }).notNull(), // 'en_curso' | 'completado' | 'planificado'
  fechaInicio: date('fecha_inicio'),
  imagenUrl: text('imagen_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================
// TABLA: centro_padres_documentos
// Documentos del Centro de Padres (actas, presupuestos, informes)
// ============================================================
export const centroPadresDocumentos = pgTable('centro_padres_documentos', {
  id: serial('id').primaryKey(),
  titulo: varchar('titulo', { length: 120 }).notNull(),
  tipo: varchar('tipo', { length: 20 }).notNull(), // 'acta' | 'presupuesto' | 'informe' | 'otro'
  archivoUrl: text('archivo_url').notNull(),
  fecha: date('fecha'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================
// TABLA: calendarios_evaluaciones
// Enlaces a calendarios de Google Calendar por curso
// ============================================================
export const calendariosEvaluaciones = pgTable('calendarios_evaluaciones', {
  id: serial('id').primaryKey(),
  curso: varchar('curso', { length: 50 }).notNull(),
  enlace: text('enlace'), // Opcional hasta que lo configuren en el admin
  ciclo: varchar('ciclo', { length: 50 }).notNull(), // 'Educación Parvularia', 'Enseñanza Básica', 'Enseñanza Media'
  orden: integer('orden').default(0).notNull(),
  activo: boolean('activo').default(false).notNull(), // Inactivo por defecto
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================
// TABLA: paginas
// Gestión de páginas dinámicas del sitio (Page Builder API)
// ============================================================
export const paginas = pgTable('paginas', {
  id: serial('id').primaryKey(),
  titulo: varchar('titulo', { length: 150 }).notNull(),
  slug: varchar('slug', { length: 150 }).notNull().unique(), // Ej: '/nuestra-historia'
  activo: boolean('activo').default(true).notNull(), // Si es false, da 404 / redirect
  mostrarEnMenu: boolean('mostrar_en_menu').default(true).notNull(), // Mostrar en Navbar/Footer
  ordenMenu: integer('orden_menu').default(0).notNull(),
  seoDescription: varchar('seo_description', { length: 300 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================
// TABLA: pagina_secciones
// Secciones o Bloques inyectados en las páginas (Page Builder API)
// ============================================================
export const paginaSecciones = pgTable('pagina_secciones', {
  id: serial('id').primaryKey(),
  paginaId: integer('pagina_id').references(() => paginas.id, { onDelete: 'cascade' }).notNull(),
  tipoBloque: varchar('tipo_bloque', { length: 50 }).notNull(), // Ej: 'HERO', 'TEXTO_ENRIQUECIDO', 'GRILLA_NOTICIAS'
  orden: integer('orden').default(0).notNull(),
  configuracion: jsonb('configuracion').default({}).notNull(), // Guarda título, IDs relacionados, estilos, etc.
  estadoActivo: boolean('estado_activo').default(true).notNull(), // Novedad: Ocultar o mostrar bloque
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================
// TABLA: configuracion_sitio
// Configuración centralizada del sitio (redes sociales, teléfonos, emails)
// ============================================================
export const configuracionSitio = pgTable('configuracion_sitio', {
  id: serial('id').primaryKey(),
  redesSociales: jsonb('redes_sociales').default([]).notNull(),
  telefonos: jsonb('telefonos').default([]).notNull(),
  emails: jsonb('emails').default([]).notNull(),
  direccion: text('direccion'),
  mapaEmbedUrl: text('mapa_embed_url'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

