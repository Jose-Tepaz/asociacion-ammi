import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// «Pueblos y orígenes» deja de ser una lista y pasa a ser una sola línea de texto.
// Las filas que ya existen toman la frase por defecto.
// Organizaciones suma una etiqueta sobre el título («Alianza»).
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_statement" ADD COLUMN "peoples_line" varchar DEFAULT 'Somos mayas, garífunas, xincas, afrodescendientes, mestizas y ladinas, en una sola alianza.';
  ALTER TABLE "_pages_v_blocks_statement" ADD COLUMN "peoples_line" varchar DEFAULT 'Somos mayas, garífunas, xincas, afrodescendientes, mestizas y ladinas, en una sola alianza.';
  ALTER TABLE "pages_blocks_members" ADD COLUMN "kicker" varchar DEFAULT 'Alianza';
  ALTER TABLE "_pages_v_blocks_members" ADD COLUMN "kicker" varchar DEFAULT 'Alianza';
  DROP TABLE "pages_blocks_statement_peoples" CASCADE;
  DROP TABLE "_pages_v_blocks_statement_peoples" CASCADE;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_statement_peoples" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  CREATE TABLE "_pages_v_blocks_statement_peoples" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"_uuid" varchar
  );
  ALTER TABLE "pages_blocks_statement_peoples" ADD CONSTRAINT "pages_blocks_statement_peoples_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_statement"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_statement_peoples" ADD CONSTRAINT "_pages_v_blocks_statement_peoples_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_statement"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_statement_peoples_order_idx" ON "pages_blocks_statement_peoples" USING btree ("_order");
  CREATE INDEX "pages_blocks_statement_peoples_parent_id_idx" ON "pages_blocks_statement_peoples" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_statement_peoples_order_idx" ON "_pages_v_blocks_statement_peoples" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_statement_peoples_parent_id_idx" ON "_pages_v_blocks_statement_peoples" USING btree ("_parent_id");
  ALTER TABLE "pages_blocks_members" DROP COLUMN "kicker";
  ALTER TABLE "_pages_v_blocks_members" DROP COLUMN "kicker";
  ALTER TABLE "pages_blocks_statement" DROP COLUMN "peoples_line";
  ALTER TABLE "_pages_v_blocks_statement" DROP COLUMN "peoples_line";`)
}
