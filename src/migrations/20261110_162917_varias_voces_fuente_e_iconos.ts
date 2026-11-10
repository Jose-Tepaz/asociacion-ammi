import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Solo agrega, no toca datos existentes:
// - Voz (cita): campo «Fuente» (source) y lista «Más voces» (more_voices) para el carrusel.
// - Cómo nos organizamos: 5 íconos más (calendario, mundo, documento, voto, escudo).

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_pages_blocks_structure_items_icon" ADD VALUE 'calendar';
  ALTER TYPE "public"."enum_pages_blocks_structure_items_icon" ADD VALUE 'globe';
  ALTER TYPE "public"."enum_pages_blocks_structure_items_icon" ADD VALUE 'document';
  ALTER TYPE "public"."enum_pages_blocks_structure_items_icon" ADD VALUE 'vote';
  ALTER TYPE "public"."enum_pages_blocks_structure_items_icon" ADD VALUE 'shield';
  ALTER TYPE "public"."enum__pages_v_blocks_structure_items_icon" ADD VALUE 'calendar';
  ALTER TYPE "public"."enum__pages_v_blocks_structure_items_icon" ADD VALUE 'globe';
  ALTER TYPE "public"."enum__pages_v_blocks_structure_items_icon" ADD VALUE 'document';
  ALTER TYPE "public"."enum__pages_v_blocks_structure_items_icon" ADD VALUE 'vote';
  ALTER TYPE "public"."enum__pages_v_blocks_structure_items_icon" ADD VALUE 'shield';
  CREATE TABLE "pages_blocks_quote_more_voices" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author" varchar,
  	"role" varchar,
  	"source" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "_pages_v_blocks_quote_more_voices" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author" varchar,
  	"role" varchar,
  	"source" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages_blocks_quote" ADD COLUMN "source" varchar;
  ALTER TABLE "_pages_v_blocks_quote" ADD COLUMN "source" varchar;
  ALTER TABLE "pages_blocks_quote_more_voices" ADD CONSTRAINT "pages_blocks_quote_more_voices_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_quote_more_voices" ADD CONSTRAINT "pages_blocks_quote_more_voices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_quote"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_quote_more_voices" ADD CONSTRAINT "_pages_v_blocks_quote_more_voices_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_quote_more_voices" ADD CONSTRAINT "_pages_v_blocks_quote_more_voices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_quote"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_quote_more_voices_order_idx" ON "pages_blocks_quote_more_voices" USING btree ("_order");
  CREATE INDEX "pages_blocks_quote_more_voices_parent_id_idx" ON "pages_blocks_quote_more_voices" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_quote_more_voices_image_idx" ON "pages_blocks_quote_more_voices" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_quote_more_voices_order_idx" ON "_pages_v_blocks_quote_more_voices" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_quote_more_voices_parent_id_idx" ON "_pages_v_blocks_quote_more_voices" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_quote_more_voices_image_idx" ON "_pages_v_blocks_quote_more_voices" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_quote_more_voices" CASCADE;
  DROP TABLE "_pages_v_blocks_quote_more_voices" CASCADE;
  ALTER TABLE "pages_blocks_structure_items" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_structure_items" ALTER COLUMN "icon" SET DEFAULT 'users'::text;
  DROP TYPE "public"."enum_pages_blocks_structure_items_icon";
  CREATE TYPE "public"."enum_pages_blocks_structure_items_icon" AS ENUM('users', 'flag', 'network', 'laptop', 'handshake', 'user', 'scale', 'megaphone', 'book', 'sprout');
  ALTER TABLE "pages_blocks_structure_items" ALTER COLUMN "icon" SET DEFAULT 'users'::"public"."enum_pages_blocks_structure_items_icon";
  ALTER TABLE "pages_blocks_structure_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_pages_blocks_structure_items_icon" USING "icon"::"public"."enum_pages_blocks_structure_items_icon";
  ALTER TABLE "_pages_v_blocks_structure_items" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_structure_items" ALTER COLUMN "icon" SET DEFAULT 'users'::text;
  DROP TYPE "public"."enum__pages_v_blocks_structure_items_icon";
  CREATE TYPE "public"."enum__pages_v_blocks_structure_items_icon" AS ENUM('users', 'flag', 'network', 'laptop', 'handshake', 'user', 'scale', 'megaphone', 'book', 'sprout');
  ALTER TABLE "_pages_v_blocks_structure_items" ALTER COLUMN "icon" SET DEFAULT 'users'::"public"."enum__pages_v_blocks_structure_items_icon";
  ALTER TABLE "_pages_v_blocks_structure_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum__pages_v_blocks_structure_items_icon" USING "icon"::"public"."enum__pages_v_blocks_structure_items_icon";
  ALTER TABLE "pages_blocks_quote" DROP COLUMN "source";
  ALTER TABLE "_pages_v_blocks_quote" DROP COLUMN "source";`)
}
