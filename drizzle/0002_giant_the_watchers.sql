ALTER TABLE "popups" ADD COLUMN IF NOT EXISTS "color_boton" varchar(50) DEFAULT '#111827' NOT NULL;--> statement-breakpoint
ALTER TABLE "popups" ADD COLUMN IF NOT EXISTS "color_texto_boton" varchar(50) DEFAULT '#ffffff' NOT NULL;--> statement-breakpoint
ALTER TABLE "popups" ADD COLUMN IF NOT EXISTS "pagina_destino" varchar(150) DEFAULT 'todas' NOT NULL;