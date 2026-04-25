CREATE TABLE "admin_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "calendarios_evaluaciones" (
	"id" serial PRIMARY KEY NOT NULL,
	"curso" varchar(50) NOT NULL,
	"enlace" text,
	"ciclo" varchar(50) NOT NULL,
	"orden" integer DEFAULT 0 NOT NULL,
	"activo" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "centro_padres_directiva" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(100) NOT NULL,
	"cargo" varchar(80) NOT NULL,
	"foto_url" text,
	"email" varchar(255),
	"orden" integer DEFAULT 0 NOT NULL,
	"periodo" varchar(20),
	"activo" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "centro_padres_documentos" (
	"id" serial PRIMARY KEY NOT NULL,
	"titulo" varchar(120) NOT NULL,
	"tipo" varchar(20) NOT NULL,
	"archivo_url" text NOT NULL,
	"fecha" date,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "centro_padres_proyectos" (
	"id" serial PRIMARY KEY NOT NULL,
	"titulo" varchar(120) NOT NULL,
	"descripcion" text NOT NULL,
	"estado" varchar(20) NOT NULL,
	"fecha_inicio" date,
	"imagen_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "configuracion_sitio" (
	"id" serial PRIMARY KEY NOT NULL,
	"redes_sociales" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"telefonos" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"emails" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"direccion" text,
	"mapa_embed_url" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coordinaciones" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre_unidad" varchar(100) NOT NULL,
	"encargada" varchar(100) NOT NULL,
	"correo_institucional" varchar(255),
	"foto_url" text,
	"funciones" text NOT NULL,
	"orden" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "descargas" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(100) NOT NULL,
	"categoria" varchar(50) NOT NULL,
	"archivo_url" text NOT NULL,
	"version" varchar(20),
	"imagen_url" text,
	"color_acento" varchar(20) DEFAULT 'azul' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "descargas_categorias" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(100) NOT NULL,
	"orden" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "eventos" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(150) NOT NULL,
	"fecha" date NOT NULL,
	"descripcion" varchar(200) NOT NULL,
	"tipo" varchar(20) DEFAULT 'general' NOT NULL,
	"imagen_url" text,
	"activo" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "galeria_albumes" (
	"id" serial PRIMARY KEY NOT NULL,
	"titulo" varchar(100) NOT NULL,
	"descripcion" varchar(300),
	"portada_url" text,
	"fecha" date,
	"orden" integer DEFAULT 0 NOT NULL,
	"activo" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "galeria_fotos" (
	"id" serial PRIMARY KEY NOT NULL,
	"album_id" integer NOT NULL,
	"tipo" varchar(20) DEFAULT 'imagen' NOT NULL,
	"imagen_url" text NOT NULL,
	"video_url" text,
	"caption" varchar(150),
	"orden" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "journal" (
	"id" serial PRIMARY KEY NOT NULL,
	"titulo" varchar(120) NOT NULL,
	"slug" varchar(150) NOT NULL,
	"categoria_id" integer,
	"autor_id" integer,
	"extracto" varchar(200) NOT NULL,
	"contenido" text NOT NULL,
	"imagen_url" text,
	"publicado" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "journal_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "journal_autores" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(100) NOT NULL,
	"cargo" varchar(100) NOT NULL,
	"correo_institucional" varchar(255),
	"foto_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "journal_categorias" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(100) NOT NULL,
	"orden" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "matricula_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"periodo_nuevos_inicio" date,
	"periodo_nuevos_fin" date,
	"periodo_antiguos_inicio" date,
	"periodo_antiguos_fin" date,
	"enlace_formulario_nuevos" text,
	"enlace_formulario_antiguos" text,
	"requisitos" jsonb,
	"mensaje_informativo" text,
	"activo" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mensajes_contacto" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"telefono" varchar(20),
	"asunto" varchar(50) NOT NULL,
	"mensaje" text NOT NULL,
	"leido" boolean DEFAULT false NOT NULL,
	"respondido" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pagina_secciones" (
	"id" serial PRIMARY KEY NOT NULL,
	"pagina_id" integer NOT NULL,
	"tipo_bloque" varchar(50) NOT NULL,
	"orden" integer DEFAULT 0 NOT NULL,
	"configuracion" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"estado_activo" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "paginas" (
	"id" serial PRIMARY KEY NOT NULL,
	"titulo" varchar(150) NOT NULL,
	"slug" varchar(150) NOT NULL,
	"activo" boolean DEFAULT true NOT NULL,
	"mostrar_en_menu" boolean DEFAULT true NOT NULL,
	"orden_menu" integer DEFAULT 0 NOT NULL,
	"seo_description" varchar(300),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "paginas_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "popups" (
	"id" serial PRIMARY KEY NOT NULL,
	"titulo" varchar(80) NOT NULL,
	"contenido" text NOT NULL,
	"imagen_url" text,
	"tipo" varchar(20) NOT NULL,
	"boton_texto" varchar(50),
	"boton_url" text,
	"fecha_inicio" date NOT NULL,
	"fecha_fin" date NOT NULL,
	"activo" boolean DEFAULT true NOT NULL,
	"frecuencia" varchar(20) NOT NULL,
	"prioridad" integer DEFAULT 5 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "journal" ADD CONSTRAINT "journal_categoria_id_journal_categorias_id_fk" FOREIGN KEY ("categoria_id") REFERENCES "public"."journal_categorias"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journal" ADD CONSTRAINT "journal_autor_id_journal_autores_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."journal_autores"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pagina_secciones" ADD CONSTRAINT "pagina_secciones_pagina_id_paginas_id_fk" FOREIGN KEY ("pagina_id") REFERENCES "public"."paginas"("id") ON DELETE cascade ON UPDATE no action;