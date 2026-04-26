ALTER TABLE "coordinaciones" ADD COLUMN "titulo_profesional" varchar(150);--> statement-breakpoint
ALTER TABLE "coordinaciones" ADD COLUMN "resena_profesional" text;--> statement-breakpoint
ALTER TABLE "matricula_config" ADD COLUMN "mensajes_antiguos" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "matricula_config" ADD COLUMN "mensajes_nuevos" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "popups" ADD COLUMN "posicion" varchar(50) DEFAULT 'inferior-derecha' NOT NULL;--> statement-breakpoint
ALTER TABLE "popups" ADD COLUMN "estilo_imagen" varchar(50) DEFAULT 'encabezado' NOT NULL;--> statement-breakpoint
ALTER TABLE "popups" ADD COLUMN "color_fondo" varchar(50) DEFAULT '#ffffff' NOT NULL;--> statement-breakpoint
ALTER TABLE "popups" ADD COLUMN "color_texto" varchar(50) DEFAULT '#111827' NOT NULL;--> statement-breakpoint
ALTER TABLE "popups" ADD COLUMN "tamano_titulo" varchar(20) DEFAULT 'md' NOT NULL;