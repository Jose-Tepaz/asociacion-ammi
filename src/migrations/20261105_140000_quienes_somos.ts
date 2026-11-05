import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_structure_items_icon" AS ENUM('users', 'flag', 'network', 'laptop', 'handshake', 'user', 'scale', 'megaphone', 'book', 'sprout');
  CREATE TYPE "public"."enum_pages_blocks_mission_layout" AS ENUM('tabs', 'rows');
  CREATE TYPE "public"."enum__pages_v_blocks_structure_items_icon" AS ENUM('users', 'flag', 'network', 'laptop', 'handshake', 'user', 'scale', 'megaphone', 'book', 'sprout');
  CREATE TYPE "public"."enum__pages_v_blocks_mission_layout" AS ENUM('tabs', 'rows');
  CREATE TABLE "pages_blocks_statement_peoples" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "pages_blocks_statement" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Qué es la AMMI',
  	"statement" varchar DEFAULT 'Somos organizaciones de mujeres, mujeres indígenas y mujeres en lo individual que, articuladas en alianza, promovemos el acceso a la justicia y la participación política de las mujeres.',
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_structure_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_structure_items_icon" DEFAULT 'users',
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_structure" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar DEFAULT 'Nosotras',
  	"heading" varchar DEFAULT 'Cómo nos organizamos',
  	"intro" varchar DEFAULT 'Las decisiones se toman entre todas. Cada espacio cumple un papel claro dentro de la Alianza.',
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_mission_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"heading" varchar,
  	"subtitle" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_mission" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout" "enum_pages_blocks_mission_layout" DEFAULT 'tabs',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_timeline_events" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Nuestra historia',
  	"intro" varchar DEFAULT 'La Alianza nace en 2013 por iniciativa de Kemb''al No''j, asociación de profesionales mayas del Ixcán, y de la Asociación Ixoqib'' Miriam, para fortalecer la institucionalidad de las mujeres y del sector justicia, en busca de una justicia pronta y cumplida, especializada, con enfoque de género y pertinencia cultural.
  
  En 2014 la convocatoria se amplió a otras organizaciones de mujeres y mujeres indígenas dedicadas a la defensa de sus derechos. Desde entonces la Alianza se ha fortalecido integrando también a mujeres en lo individual.
  
  Ha elaborado propuestas para coordinar y armonizar el sistema de justicia oficial con la justicia ancestral, indígena y comunitaria, y ha vigilado y denunciado la violencia contra las mujeres en los procesos electorales.
  
  También ha impulsado estudios sobre justicia especializada con pertinencia cultural y campañas contra la corrupción, la impunidad y el despojo de los territorios.',
  	"background_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_statement_peoples" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_statement" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Qué es la AMMI',
  	"statement" varchar DEFAULT 'Somos organizaciones de mujeres, mujeres indígenas y mujeres en lo individual que, articuladas en alianza, promovemos el acceso a la justicia y la participación política de las mujeres.',
  	"image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_structure_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_structure_items_icon" DEFAULT 'users',
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_structure" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar DEFAULT 'Nosotras',
  	"heading" varchar DEFAULT 'Cómo nos organizamos',
  	"intro" varchar DEFAULT 'Las decisiones se toman entre todas. Cada espacio cumple un papel claro dentro de la Alianza.',
  	"image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_mission_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"heading" varchar,
  	"subtitle" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_mission" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout" "enum__pages_v_blocks_mission_layout" DEFAULT 'tabs',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_timeline_events" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"year" varchar,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Nuestra historia',
  	"intro" varchar DEFAULT 'La Alianza nace en 2013 por iniciativa de Kemb''al No''j, asociación de profesionales mayas del Ixcán, y de la Asociación Ixoqib'' Miriam, para fortalecer la institucionalidad de las mujeres y del sector justicia, en busca de una justicia pronta y cumplida, especializada, con enfoque de género y pertinencia cultural.
  
  En 2014 la convocatoria se amplió a otras organizaciones de mujeres y mujeres indígenas dedicadas a la defensa de sus derechos. Desde entonces la Alianza se ha fortalecido integrando también a mujeres en lo individual.
  
  Ha elaborado propuestas para coordinar y armonizar el sistema de justicia oficial con la justicia ancestral, indígena y comunitaria, y ha vigilado y denunciado la violencia contra las mujeres en los procesos electorales.
  
  También ha impulsado estudios sobre justicia especializada con pertinencia cultural y campañas contra la corrupción, la impunidad y el despojo de los territorios.',
  	"background_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_members_organizations" ADD COLUMN "acronym" varchar;
  ALTER TABLE "pages_blocks_members_organizations" ADD COLUMN "category" varchar;
  ALTER TABLE "pages_blocks_members_organizations" ADD COLUMN "logo_id" integer;
  ALTER TABLE "_pages_v_blocks_members_organizations" ADD COLUMN "acronym" varchar;
  ALTER TABLE "_pages_v_blocks_members_organizations" ADD COLUMN "category" varchar;
  ALTER TABLE "_pages_v_blocks_members_organizations" ADD COLUMN "logo_id" integer;
  ALTER TABLE "pages_blocks_statement_peoples" ADD CONSTRAINT "pages_blocks_statement_peoples_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_statement"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_statement" ADD CONSTRAINT "pages_blocks_statement_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_statement" ADD CONSTRAINT "pages_blocks_statement_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_structure_items" ADD CONSTRAINT "pages_blocks_structure_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_structure"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_structure" ADD CONSTRAINT "pages_blocks_structure_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_structure" ADD CONSTRAINT "pages_blocks_structure_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_mission_items" ADD CONSTRAINT "pages_blocks_mission_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_mission"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_mission" ADD CONSTRAINT "pages_blocks_mission_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline_events" ADD CONSTRAINT "pages_blocks_timeline_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline" ADD CONSTRAINT "pages_blocks_timeline_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline" ADD CONSTRAINT "pages_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_statement_peoples" ADD CONSTRAINT "_pages_v_blocks_statement_peoples_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_statement"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_statement" ADD CONSTRAINT "_pages_v_blocks_statement_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_statement" ADD CONSTRAINT "_pages_v_blocks_statement_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_structure_items" ADD CONSTRAINT "_pages_v_blocks_structure_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_structure"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_structure" ADD CONSTRAINT "_pages_v_blocks_structure_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_structure" ADD CONSTRAINT "_pages_v_blocks_structure_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_mission_items" ADD CONSTRAINT "_pages_v_blocks_mission_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_mission"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_mission" ADD CONSTRAINT "_pages_v_blocks_mission_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline_events" ADD CONSTRAINT "_pages_v_blocks_timeline_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline" ADD CONSTRAINT "_pages_v_blocks_timeline_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline" ADD CONSTRAINT "_pages_v_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_statement_peoples_order_idx" ON "pages_blocks_statement_peoples" USING btree ("_order");
  CREATE INDEX "pages_blocks_statement_peoples_parent_id_idx" ON "pages_blocks_statement_peoples" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_statement_order_idx" ON "pages_blocks_statement" USING btree ("_order");
  CREATE INDEX "pages_blocks_statement_parent_id_idx" ON "pages_blocks_statement" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_statement_path_idx" ON "pages_blocks_statement" USING btree ("_path");
  CREATE INDEX "pages_blocks_statement_image_idx" ON "pages_blocks_statement" USING btree ("image_id");
  CREATE INDEX "pages_blocks_structure_items_order_idx" ON "pages_blocks_structure_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_structure_items_parent_id_idx" ON "pages_blocks_structure_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_structure_order_idx" ON "pages_blocks_structure" USING btree ("_order");
  CREATE INDEX "pages_blocks_structure_parent_id_idx" ON "pages_blocks_structure" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_structure_path_idx" ON "pages_blocks_structure" USING btree ("_path");
  CREATE INDEX "pages_blocks_structure_image_idx" ON "pages_blocks_structure" USING btree ("image_id");
  CREATE INDEX "pages_blocks_mission_items_order_idx" ON "pages_blocks_mission_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_mission_items_parent_id_idx" ON "pages_blocks_mission_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_mission_order_idx" ON "pages_blocks_mission" USING btree ("_order");
  CREATE INDEX "pages_blocks_mission_parent_id_idx" ON "pages_blocks_mission" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_mission_path_idx" ON "pages_blocks_mission" USING btree ("_path");
  CREATE INDEX "pages_blocks_timeline_events_order_idx" ON "pages_blocks_timeline_events" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_events_parent_id_idx" ON "pages_blocks_timeline_events" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_order_idx" ON "pages_blocks_timeline" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_parent_id_idx" ON "pages_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_path_idx" ON "pages_blocks_timeline" USING btree ("_path");
  CREATE INDEX "pages_blocks_timeline_background_idx" ON "pages_blocks_timeline" USING btree ("background_id");
  CREATE INDEX "_pages_v_blocks_statement_peoples_order_idx" ON "_pages_v_blocks_statement_peoples" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_statement_peoples_parent_id_idx" ON "_pages_v_blocks_statement_peoples" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_statement_order_idx" ON "_pages_v_blocks_statement" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_statement_parent_id_idx" ON "_pages_v_blocks_statement" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_statement_path_idx" ON "_pages_v_blocks_statement" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_statement_image_idx" ON "_pages_v_blocks_statement" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_structure_items_order_idx" ON "_pages_v_blocks_structure_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_structure_items_parent_id_idx" ON "_pages_v_blocks_structure_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_structure_order_idx" ON "_pages_v_blocks_structure" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_structure_parent_id_idx" ON "_pages_v_blocks_structure" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_structure_path_idx" ON "_pages_v_blocks_structure" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_structure_image_idx" ON "_pages_v_blocks_structure" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_mission_items_order_idx" ON "_pages_v_blocks_mission_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_mission_items_parent_id_idx" ON "_pages_v_blocks_mission_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_mission_order_idx" ON "_pages_v_blocks_mission" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_mission_parent_id_idx" ON "_pages_v_blocks_mission" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_mission_path_idx" ON "_pages_v_blocks_mission" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_timeline_events_order_idx" ON "_pages_v_blocks_timeline_events" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_timeline_events_parent_id_idx" ON "_pages_v_blocks_timeline_events" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_order_idx" ON "_pages_v_blocks_timeline" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_timeline_parent_id_idx" ON "_pages_v_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_path_idx" ON "_pages_v_blocks_timeline" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_timeline_background_idx" ON "_pages_v_blocks_timeline" USING btree ("background_id");
  ALTER TABLE "pages_blocks_members_organizations" ADD CONSTRAINT "pages_blocks_members_organizations_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_members_organizations" ADD CONSTRAINT "_pages_v_blocks_members_organizations_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_members_organizations_logo_idx" ON "pages_blocks_members_organizations" USING btree ("logo_id");
  CREATE INDEX "_pages_v_blocks_members_organizations_logo_idx" ON "_pages_v_blocks_members_organizations" USING btree ("logo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_statement_peoples" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_statement" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_structure_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_structure" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_mission_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_mission" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_timeline_events" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_timeline" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_statement_peoples" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_statement" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_structure_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_structure" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_mission_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_mission" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_timeline_events" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_timeline" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_statement_peoples" CASCADE;
  DROP TABLE "pages_blocks_statement" CASCADE;
  DROP TABLE "pages_blocks_structure_items" CASCADE;
  DROP TABLE "pages_blocks_structure" CASCADE;
  DROP TABLE "pages_blocks_mission_items" CASCADE;
  DROP TABLE "pages_blocks_mission" CASCADE;
  DROP TABLE "pages_blocks_timeline_events" CASCADE;
  DROP TABLE "pages_blocks_timeline" CASCADE;
  DROP TABLE "_pages_v_blocks_statement_peoples" CASCADE;
  DROP TABLE "_pages_v_blocks_statement" CASCADE;
  DROP TABLE "_pages_v_blocks_structure_items" CASCADE;
  DROP TABLE "_pages_v_blocks_structure" CASCADE;
  DROP TABLE "_pages_v_blocks_mission_items" CASCADE;
  DROP TABLE "_pages_v_blocks_mission" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline_events" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline" CASCADE;
  ALTER TABLE "pages_blocks_members_organizations" DROP CONSTRAINT "pages_blocks_members_organizations_logo_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_members_organizations" DROP CONSTRAINT "_pages_v_blocks_members_organizations_logo_id_media_id_fk";
  
  DROP INDEX "pages_blocks_members_organizations_logo_idx";
  DROP INDEX "_pages_v_blocks_members_organizations_logo_idx";
  ALTER TABLE "pages_blocks_members_organizations" DROP COLUMN "acronym";
  ALTER TABLE "pages_blocks_members_organizations" DROP COLUMN "category";
  ALTER TABLE "pages_blocks_members_organizations" DROP COLUMN "logo_id";
  ALTER TABLE "_pages_v_blocks_members_organizations" DROP COLUMN "acronym";
  ALTER TABLE "_pages_v_blocks_members_organizations" DROP COLUMN "category";
  ALTER TABLE "_pages_v_blocks_members_organizations" DROP COLUMN "logo_id";
  DROP TYPE "public"."enum_pages_blocks_structure_items_icon";
  DROP TYPE "public"."enum_pages_blocks_mission_layout";
  DROP TYPE "public"."enum__pages_v_blocks_structure_items_icon";
  DROP TYPE "public"."enum__pages_v_blocks_mission_layout";`)
}
