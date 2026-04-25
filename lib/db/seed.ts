/**
 * 🌱 SEED — Datos de ejemplo para Colegio Acrópolis
 *
 * Ejecutar:  npx tsx lib/db/seed.ts
 *
 * Inserta datos realistas en TODAS las tablas del sistema para que:
 *  - La web pública se vea completa desde el primer despliegue
 *  - El dashboard se pueda probar de inmediato (editar, eliminar, exportar)
 *  - El administrador entienda qué contenido va en cada sección
 *
 * ⚠️  Este script es ADITIVO: no borra datos existentes.
 *     Si quieres reiniciar, vacía las tablas manualmente.
 */

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import 'dotenv/config';

async function seed() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL no configurada. Agrega la variable al .env');
    process.exit(1);
  }

  const sql = neon(databaseUrl);
  const db = drizzle(sql, { schema });

  console.log('🌱 Iniciando seed de Colegio Acrópolis...\n');

  // ──────────────────────────────────────────────
  // 1. JOURNAL (Noticias)
  // ──────────────────────────────────────────────
  console.log('📰 Insertando categorías de journal...');
  const catJournal = await db.insert(schema.journalCategorias).values([
    { nombre: 'Institucional', orden: 1 },
    { nombre: 'Académico', orden: 2 },
    { nombre: 'Actividades', orden: 3 },
    { nombre: 'Comunidad', orden: 4 },
  ]).returning();

  const cMap: Record<string, number> = {};
  catJournal.forEach((c) => { cMap[c.nombre.toLowerCase()] = c.id; });

  console.log('✍️ Insertando autores de journal...');
  const autoresJournal = await db.insert(schema.journalAutores).values([
    { nombre: 'Dirección Colegio Acrópolis', cargo: 'Comunicaciones', fotoUrl: 'https://images.unsplash.com/photo-1546410531-b4fa7cb0b5bc?w=200&q=80' },
    { nombre: 'Centro de Padres', cargo: 'Directiva', fotoUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=200&q=80' },
  ]).returning();

  const adminId = autoresJournal[0].id;
  const cgpId = autoresJournal[1].id;

  console.log('📰 Insertando noticias de ejemplo...');
  await db.insert(schema.journal).values([
    {
      titulo: 'Inicio del Año Escolar 2026',
      slug: 'inicio-ano-escolar-2026',
      categoriaId: cMap['institucional'],
      autorId: adminId,
      extracto: 'El Colegio Acrópolis da la bienvenida a toda la comunidad educativa en este nuevo año lleno de desafíos y aprendizajes.',
      contenido: `<h2>¡Bienvenidos al Año Escolar 2026!</h2>
<p>Con gran entusiasmo recibimos a nuestros estudiantes, familias y equipo docente para este nuevo ciclo escolar. Este año hemos preparado mejoras en infraestructura, nuevos talleres extracurriculares y un calendario de actividades que fortalecerá el desarrollo integral de cada estudiante.</p>
<h3>Novedades 2026</h3>
<ul>
<li>Nuevo laboratorio de ciencias completamente equipado</li>
<li>Taller de robótica para 5° a 8° básico</li>
<li>Programa de huerto escolar comunitario</li>
<li>Ampliación de la biblioteca con más de 500 nuevos títulos</li>
</ul>
<p>Los invitamos a participar activamente en las reuniones de apoderados y actividades del Centro de Padres.</p>`,
      imagenUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80',
      publicado: true,
    },
    {
      titulo: 'Resultados Destacados en Olimpíada de Matemáticas',
      slug: 'resultados-olimpiada-matematicas-2026',
      categoriaId: cMap['académico'],
      autorId: adminId,
      extracto: 'Nuestros estudiantes obtuvieron medallas de oro y plata en la Olimpíada Regional de Matemáticas 2026.',
      contenido: `<h2>¡Orgullo Acrópolis!</h2>
<p>Felicitamos a los estudiantes que representaron al colegio en la XII Olimpíada Regional de Matemáticas, obteniendo resultados sobresalientes que demuestran el nivel académico de nuestra institución.</p>
<h3>Medallistas</h3>
<ul>
<li><strong>Medalla de Oro:</strong> Valentina Rojas (7° básico)</li>
<li><strong>Medalla de Plata:</strong> Martín Carrasco (8° básico)</li>
<li><strong>Mención Honrosa:</strong> Sofía Muñoz (6° básico)</li>
</ul>
<p>El equipo fue preparado por la profesora María Eugenia Soto, coordinadora del Departamento de Matemáticas.</p>`,
      imagenUrl: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&q=80',
      publicado: true,
    },
    {
      titulo: 'Feria Científica Intercomunal',
      slug: 'feria-cientifica-intercomunal-2026',
      categoriaId: cMap['actividades'],
      autorId: adminId,
      extracto: 'El colegio será sede de la Feria Científica Intercomunal con proyectos de más de 12 establecimientos de la zona.',
      contenido: `<h2>Feria Científica Intercomunal 2026</h2>
<p>Este año, el Colegio Acrópolis tiene el honor de ser la sede oficial de la Feria Científica Intercomunal, evento que reunirá a más de 12 establecimientos educacionales de la zona.</p>
<p>Nuestros estudiantes presentarán proyectos en las áreas de medio ambiente, energías renovables y tecnología aplicada. La feria estará abierta a toda la comunidad.</p>
<h3>Información Práctica</h3>
<ul>
<li><strong>Fecha:</strong> 15 de junio de 2026</li>
<li><strong>Horario:</strong> 09:00 a 17:00 hrs</li>
<li><strong>Lugar:</strong> Gimnasio y patios del colegio</li>
<li><strong>Entrada:</strong> Libre para toda la comunidad</li>
</ul>`,
      imagenUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80',
      publicado: true,
    },
    {
      titulo: 'Taller de Convivencia Escolar para Apoderados',
      slug: 'taller-convivencia-escolar-apoderados',
      categoriaId: cMap['comunidad'],
      autorId: cgpId,
      extracto: 'Invitamos a todas las familias a participar del taller sobre convivencia escolar y comunicación efectiva en el hogar.',
      contenido: `<h2>Taller de Convivencia Escolar</h2>
<p>El Departamento de Orientación invita a todos los apoderados al taller "Construyendo Puentes: Convivencia y Comunicación en la Familia", una instancia de aprendizaje y reflexión sobre la importancia del diálogo familiar en el desarrollo socioemocional de los estudiantes.</p>
<p>El taller será facilitado por la psicóloga educacional Claudia Henríquez y contará con dinámicas grupales y material de apoyo para las familias.</p>`,
      imagenUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80',
      publicado: true,
    },
  ]);

  // ──────────────────────────────────────────────
  // 2. COORDINACIONES (9 unidades)
  // ──────────────────────────────────────────────
  console.log('🏫 Insertando coordinaciones...');
  await db.insert(schema.coordinaciones).values([
    {
      nombreUnidad: 'Dirección',
      encargada: 'Patricia González Álvarez',
      funciones: 'Liderar la gestión institucional, pedagógica y administrativa del colegio. Representar al establecimiento ante el Ministerio de Educación y la comunidad. Velar por el cumplimiento del Proyecto Educativo Institucional.',
      orden: 1,
    },
    {
      nombreUnidad: 'Unidad Técnico-Pedagógica (UTP)',
      encargada: 'Francisca Navarro Riquelme',
      funciones: 'Coordinar la planificación curricular y evaluativa. Supervisar el proceso de enseñanza-aprendizaje. Liderar las jornadas de reflexión pedagógica y capacitación docente.',
      orden: 2,
    },
    {
      nombreUnidad: 'Inspectoría General',
      encargada: 'Roberto Maldonado Castro',
      funciones: 'Supervisar la asistencia, puntualidad y disciplina escolar. Gestionar los registros de matrícula y documentación estudiantil. Coordinar el uso de espacios y recursos institucionales.',
      orden: 3,
    },
    {
      nombreUnidad: 'Coordinación de Convivencia Escolar',
      encargada: 'Andrea Sepúlveda Lagos',
      funciones: 'Implementar el Plan de Gestión de Convivencia Escolar. Mediar en la resolución de conflictos. Promover un ambiente de respeto, inclusión y buen trato en toda la comunidad educativa.',
      orden: 4,
    },
    {
      nombreUnidad: 'Departamento de Orientación',
      encargada: 'Claudia Henríquez Parra',
      funciones: 'Acompañar el desarrollo socioemocional de los estudiantes. Coordinar el programa de orientación vocacional. Gestionar derivaciones y apoyos psicosociales junto al equipo multidisciplinario.',
      orden: 5,
    },
    {
      nombreUnidad: 'Coordinación Extraescolar',
      encargada: 'Diego Fuentes Aravena',
      funciones: 'Organizar los talleres extracurriculares deportivos, artísticos y culturales. Coordinar la participación del colegio en campeonatos y competencias interescolares.',
      orden: 6,
    },
    {
      nombreUnidad: 'Coordinación de Ciclo Prebásica',
      encargada: 'Carolina Bravo Espinoza',
      funciones: 'Liderar los niveles de Prekínder y Kínder. Coordinar la articulación con primer ciclo básico. Supervisar el programa de estimulación temprana y juego pedagógico.',
      orden: 7,
    },
    {
      nombreUnidad: 'Coordinación de Ciclo Básico',
      encargada: 'Marcela Oyarzún Torres',
      funciones: 'Coordinar la gestión pedagógica de 1° a 8° básico. Supervisar la evaluación diferenciada y los planes de apoyo. Gestionar la comunicación con las familias del ciclo.',
      orden: 8,
    },
    {
      nombreUnidad: 'Coordinación PIE',
      encargada: 'Javiera Contreras Muñoz',
      funciones: 'Dirigir el Programa de Integración Escolar (PIE). Coordinar al equipo de especialistas (psicólogos, fonoaudiólogos, educadoras diferenciales). Asegurar los apoyos para estudiantes con NEE.',
      orden: 9,
    },
  ]);

  // ──────────────────────────────────────────────
  // 3. EVENTOS (calendario escolar)
  // ──────────────────────────────────────────────
  console.log('📅 Insertando eventos de ejemplo...');
  await db.insert(schema.eventos).values([
    {
      nombre: 'Reunión de Apoderados — Primer Semestre',
      fecha: '2026-04-22',
      descripcion: 'Primera reunión general de apoderados del año. Se presentará el plan anual y las líneas de trabajo por curso.',
      tipo: 'general',
      activo: true,
    },
    {
      nombre: 'Día del Libro — Maratón de Lectura',
      fecha: '2026-04-23',
      descripcion: 'Celebración del Día del Libro con actividades de lectura compartida, cuentacuentos y feria de libros usados.',
      tipo: 'academico',
      activo: true,
    },
    {
      nombre: 'Día de la Madre — Acto Artístico',
      fecha: '2026-05-09',
      descripcion: 'Acto conmemorativo con presentaciones artísticas de los estudiantes para celebrar a las madres y figuras maternas.',
      tipo: 'conmemorativo',
      activo: true,
    },
    {
      nombre: 'Feria Científica Intercomunal',
      fecha: '2026-06-15',
      descripcion: 'El colegio será sede de la Feria Científica Intercomunal con proyectos de más de 12 establecimientos.',
      tipo: 'academico',
      activo: true,
    },
    {
      nombre: 'Vacaciones de Invierno',
      fecha: '2026-07-06',
      descripcion: 'Inicio del receso invernal. Las clases se reanudan el 20 de julio.',
      tipo: 'general',
      activo: true,
    },
    {
      nombre: 'Aniversario del Colegio',
      fecha: '2026-08-18',
      descripcion: 'Semana aniversario con alianzas deportivas, show de talentos, fiesta de disfraces y gala artística.',
      tipo: 'conmemorativo',
      activo: true,
    },
    {
      nombre: 'Fiestas Patrias — Acto Cívico',
      fecha: '2026-09-17',
      descripcion: 'Acto cívico y muestra de cuecas, juegos típicos y degustación de comida chilena preparada por las familias.',
      tipo: 'conmemorativo',
      activo: true,
    },
    {
      nombre: 'Día del Profesor',
      fecha: '2026-10-16',
      descripcion: 'Homenaje al equipo docente con acto artístico organizado por los estudiantes y Centro de Padres.',
      tipo: 'conmemorativo',
      activo: true,
    },
    {
      nombre: 'Muestra de Talleres Extraescolares',
      fecha: '2026-11-14',
      descripcion: 'Presentación pública de los avances de talleres de teatro, robótica, huerto, y deporte.',
      tipo: 'actividades',
      activo: true,
    },
    {
      nombre: 'Ceremonia de Licenciatura 8° Básico',
      fecha: '2026-12-12',
      descripcion: 'Ceremonia formal de egreso de la promoción 2026 de 8° básico con entrega de diplomas y distinciones.',
      tipo: 'general',
      activo: true,
    },
  ]);

  // ──────────────────────────────────────────────
  // 4. CATEGORÍAS DE DESCARGAS
  // ──────────────────────────────────────────────
  console.log('🏷️  Insertando categorías de descargas...');
  const categoriasInsertadas = await db.insert(schema.descargasCategorias).values([
    { nombre: 'Documentos Oficiales', orden: 1 },
    { nombre: 'Reglamentos', orden: 2 },
    { nombre: 'Formularios y Certificados', orden: 3 },
    { nombre: 'Material Pedagógico', orden: 4 },
  ]).returning();

  // ──────────────────────────────────────────────
  // 5. DESCARGAS
  // ──────────────────────────────────────────────
  console.log('📥 Insertando documentos de descarga...');
  const catMap: Record<string, string> = {};
  categoriasInsertadas.forEach((c) => { catMap[c.nombre] = c.id.toString(); });

  await db.insert(schema.descargas).values([
    {
      nombre: 'Proyecto Educativo Institucional (PEI)',
      categoria: catMap['Documentos Oficiales'],
      archivoUrl: 'https://ejemplo.com/docs/pei-acropolis-2026.pdf',
      version: '2026',
      colorAcento: 'azul',
    },
    {
      nombre: 'Reglamento Interno de Evaluación (RIE)',
      categoria: catMap['Reglamentos'],
      archivoUrl: 'https://ejemplo.com/docs/rie-acropolis-2026.pdf',
      version: 'V3.0',
      colorAcento: 'fucsia',
    },
    {
      nombre: 'Manual de Convivencia Escolar',
      categoria: catMap['Reglamentos'],
      archivoUrl: 'https://ejemplo.com/docs/manual-convivencia-2026.pdf',
      version: '2026',
      colorAcento: 'fucsia',
    },
    {
      nombre: 'Formulario de Autorización Salida Pedagógica',
      categoria: catMap['Formularios y Certificados'],
      archivoUrl: 'https://ejemplo.com/docs/autorizacion-salida.pdf',
      version: null,
      colorAcento: 'cian',
    },
    {
      nombre: 'Lista de Útiles Escolares 2026',
      categoria: catMap['Material Pedagógico'],
      archivoUrl: 'https://ejemplo.com/docs/utiles-2026.pdf',
      version: '2026',
      colorAcento: 'amarillo',
    },
    {
      nombre: 'Calendario Escolar Anual',
      categoria: catMap['Documentos Oficiales'],
      archivoUrl: 'https://ejemplo.com/docs/calendario-2026.pdf',
      version: '2026',
      colorAcento: 'azul',
    },
  ]);

  // ──────────────────────────────────────────────
  // 6. POPUPS
  // ──────────────────────────────────────────────
  console.log('💬 Insertando popups de ejemplo...');
  await db.insert(schema.popups).values([
    {
      titulo: '¡Matrículas Abiertas 2027!',
      contenido: 'Ya comenzó el proceso de matrícula para nuevos estudiantes. Consulta los requisitos y plazos en nuestra sección de admisión.',
      tipo: 'matricula',
      botonTexto: 'Ver Requisitos',
      botonUrl: '/matricula',
      fechaInicio: '2026-08-01',
      fechaFin: '2026-11-30',
      activo: false,
      frecuencia: 'una_vez',
      prioridad: 10,
    },
    {
      titulo: 'Reunión de Apoderados',
      contenido: 'Recordatorio: La reunión general de apoderados se realizará el 22 de abril a las 18:30 hrs en el gimnasio del colegio.',
      tipo: 'info',
      botonTexto: 'Más Información',
      botonUrl: '/eventos',
      fechaInicio: '2026-04-18',
      fechaFin: '2026-04-22',
      activo: true,
      frecuencia: 'una_vez_por_dia',
      prioridad: 7,
    },
  ]);

  // ──────────────────────────────────────────────
  // 7. GALERÍA — Álbumes y Fotos
  // ──────────────────────────────────────────────
  console.log('🖼️  Insertando galería de ejemplo...');
  const albumes = await db.insert(schema.galeriaAlbumes).values([
    {
      titulo: 'Ceremonia de Inicio de Clases 2026',
      descripcion: 'Acto inauguración del año escolar con izamiento de bandera y bienvenida a los nuevos estudiantes.',
      portadaUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80',
      orden: 1,
      activo: true,
    },
    {
      titulo: 'Día de la Actividad Física',
      descripcion: 'Jornada deportiva con carreras, competencias por cursos y actividades recreativas para toda la comunidad.',
      portadaUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80',
      orden: 2,
      activo: true,
    },
    {
      titulo: 'Taller de Huerto Escolar',
      descripcion: 'Los estudiantes de 3° y 4° básico aprenden a cultivar hortalizas en nuestro huerto comunitario.',
      portadaUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80',
      orden: 3,
      activo: true,
    },
  ]).returning();

  // Fotos para el primer álbum
  if (albumes.length > 0) {
    await db.insert(schema.galeriaFotos).values([
      { albumId: albumes[0].id, imagenUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80', caption: 'Bienvenida en el patio principal', orden: 1 },
      { albumId: albumes[0].id, imagenUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80', caption: 'Familias en la ceremonia', orden: 2 },
      { albumId: albumes[0].id, imagenUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80', caption: 'Estudiantes en el aula', orden: 3 },
    ]);

    if (albumes.length > 1) {
      await db.insert(schema.galeriaFotos).values([
        { albumId: albumes[1].id, imagenUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80', caption: 'Competencia de atletismo', orden: 1 },
        { albumId: albumes[1].id, imagenUrl: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=800&q=80', caption: 'Juegos cooperativos', orden: 2 },
      ]);
    }
  }

  // ──────────────────────────────────────────────
  // 8. MENSAJES DE CONTACTO (ejemplo)
  // ──────────────────────────────────────────────
  console.log('✉️  Insertando mensajes de contacto de ejemplo...');
  await db.insert(schema.mensajesContacto).values([
    {
      nombre: 'María Fernanda López',
      email: 'mflopez@ejemplo.com',
      telefono: '+56912345678',
      asunto: 'admision',
      mensaje: 'Buenos días, me gustaría saber los requisitos para matricular a mi hija en 3° básico para el año 2027. ¿Cuáles son los pasos a seguir? Muchas gracias.',
      leido: false,
      respondido: false,
    },
    {
      nombre: 'Carlos Andrés Vargas',
      email: 'cavargas@ejemplo.com',
      telefono: '+56987654321',
      asunto: 'consulta_general',
      mensaje: 'Hola, soy apoderado de un alumno de 5° básico. Quisiera consultar el horario del taller de robótica y si aún hay cupos disponibles.',
      leido: true,
      respondido: false,
    },
    {
      nombre: 'Valentina Rojas Pérez',
      email: 'vrojas@ejemplo.com',
      telefono: null,
      asunto: 'felicitaciones',
      mensaje: 'Quiero felicitar al equipo del colegio por la excelente organización de la Feria Científica. Mis hijos quedaron muy motivados. ¡Sigan así!',
      leido: true,
      respondido: true,
    },
  ]);

  // ──────────────────────────────────────────────
  // 9. MATRÍCULA CONFIG
  // ──────────────────────────────────────────────
  console.log('📋 Insertando configuración de matrícula...');
  await db.insert(schema.matriculaConfig).values({
    periodoNuevosInicio: '2026-08-01',
    periodoNuevosFin: '2026-11-30',
    periodoAntiguosInicio: '2026-11-15',
    periodoAntiguosFin: '2026-12-15',
    enlaceFormularioNuevos: 'https://ejemplo.com/formulario-nuevos',
    enlaceFormularioAntiguos: 'https://ejemplo.com/formulario-antiguos',
    requisitos: JSON.stringify([
      'Certificado de nacimiento del estudiante',
      'Certificado de notas del año anterior',
      'Informe de personalidad del colegio de origen',
      'Foto tamaño carnet (2 unidades)',
      'Fotocopia de cédula de identidad del apoderado',
      'Certificado de residencia (para postulantes SAE)',
    ]),
    mensajeInformativo: 'El proceso de admisión 2027 se rige por el Sistema de Admisión Escolar (SAE). Los resultados se publicarán en la plataforma oficial del Mineduc.',
    activo: true,
  });

  // ──────────────────────────────────────────────
  // 10. CENTRO DE PADRES — Directiva
  // ──────────────────────────────────────────────
  console.log('👥 Insertando directiva Centro de Padres...');
  await db.insert(schema.centroPadresDirectiva).values([
    { nombre: 'Lorena Figueroa Martínez', cargo: 'Presidenta', orden: 1, periodo: '2025-2026', activo: true },
    { nombre: 'Andrés Salazar Riquelme', cargo: 'Vicepresidente', orden: 2, periodo: '2025-2026', activo: true },
    { nombre: 'Pamela Cortés Guzmán', cargo: 'Secretaria', orden: 3, periodo: '2025-2026', activo: true },
    { nombre: 'Rodrigo Espinoza Vidal', cargo: 'Tesorero', orden: 4, periodo: '2025-2026', activo: true },
    { nombre: 'Carmen Gloria Reyes', cargo: 'Delegada de Convivencia', orden: 5, periodo: '2025-2026', activo: true },
  ]);

  // ──────────────────────────────────────────────
  // 11. CENTRO DE PADRES — Proyectos
  // ──────────────────────────────────────────────
  console.log('📌 Insertando proyectos del Centro de Padres...');
  await db.insert(schema.centroPadresProyectos).values([
    {
      titulo: 'Mejoramiento del Patio Techado',
      descripcion: 'Proyecto para techar el patio central del colegio, permitiendo que los estudiantes puedan realizar actividades al aire libre incluso en días de lluvia. Se contempla una estructura metálica con cubierta de policarbonato.',
      estado: 'en_curso',
      fechaInicio: '2026-03-01',
    },
    {
      titulo: 'Implementación de Biblioteca Comunitaria',
      descripcion: 'Campaña de recolección de libros usados en buen estado para ampliar el catálogo de la biblioteca escolar. Incluye la creación de un rincón de lectura para párvulos.',
      estado: 'completado',
      fechaInicio: '2025-08-15',
    },
    {
      titulo: 'Talleres de Verano para Estudiantes',
      descripcion: 'Organización de talleres recreativos y deportivos durante enero para los estudiantes del colegio. Incluye fútbol, manualidades, cocina saludable y natación.',
      estado: 'planificado',
      fechaInicio: '2027-01-05',
    },
  ]);

  // ──────────────────────────────────────────────
  // 12. CENTRO DE PADRES — Documentos
  // ──────────────────────────────────────────────
  console.log('📄 Insertando documentos del Centro de Padres...');
  await db.insert(schema.centroPadresDocumentos).values([
    {
      titulo: 'Acta Reunión Ordinaria — Marzo 2026',
      tipo: 'acta',
      archivoUrl: 'https://ejemplo.com/docs/acta-marzo-2026.pdf',
      fecha: '2026-03-20',
    },
    {
      titulo: 'Presupuesto Anual Centro de Padres 2026',
      tipo: 'presupuesto',
      archivoUrl: 'https://ejemplo.com/docs/presupuesto-cpp-2026.pdf',
      fecha: '2026-03-05',
    },
    {
      titulo: 'Informe Semestral de Gestión 2025',
      tipo: 'informe',
      archivoUrl: 'https://ejemplo.com/docs/informe-gestion-2025-s2.pdf',
      fecha: '2025-12-15',
    },
  ]);

  // ──────────────────────────────────────────────
  console.log('\n✅ ¡Seed completado exitosamente!');
  console.log('──────────────────────────────────────');
  console.log('📰 4 noticias (Journal)');
  console.log('🏫 9 coordinaciones');
  console.log('📅 10 eventos');
  console.log('🏷️  4 categorías de descargas');
  console.log('📥 6 documentos de descarga');
  console.log('💬 2 popups');
  console.log('🖼️  3 álbumes + 5 fotos');
  console.log('✉️  3 mensajes de contacto');
  console.log('📋 1 config de matrícula');
  console.log('👥 5 directivos Centro de Padres');
  console.log('📌 3 proyectos Centro de Padres');
  console.log('📄 3 documentos Centro de Padres');
  console.log('──────────────────────────────────────');
  console.log('💡 Ahora puedes ir al dashboard y ver todo funcionando.');
  console.log('   Reemplaza los datos de ejemplo por los reales cuando quieras.');
}

seed().catch((err) => {
  console.error('❌ Error durante el seed:', err);
  process.exit(1);
});
