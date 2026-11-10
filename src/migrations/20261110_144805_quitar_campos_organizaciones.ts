import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Organizaciones (bloque Members) queda solo con Nombre y Logo: el carrusel no usa
// Siglas, Categoría, Enfoque, Territorio ni Sitio web. BORRA esas columnas y su
// contenido: requiere aprobación y un branch `respaldo-antes-de-quitar-campos-organizaciones`.
// El `down` vuelve a crear las columnas, pero vacías.

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_members_organizations" DROP COLUMN "acronym";
  ALTER TABLE "pages_blocks_members_organizations" DROP COLUMN "category";
  ALTER TABLE "pages_blocks_members_organizations" DROP COLUMN "focus";
  ALTER TABLE "pages_blocks_members_organizations" DROP COLUMN "place";
  ALTER TABLE "pages_blocks_members_organizations" DROP COLUMN "url";
  ALTER TABLE "_pages_v_blocks_members_organizations" DROP COLUMN "acronym";
  ALTER TABLE "_pages_v_blocks_members_organizations" DROP COLUMN "category";
  ALTER TABLE "_pages_v_blocks_members_organizations" DROP COLUMN "focus";
  ALTER TABLE "_pages_v_blocks_members_organizations" DROP COLUMN "place";
  ALTER TABLE "_pages_v_blocks_members_organizations" DROP COLUMN "url";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_members_organizations" ADD COLUMN "acronym" varchar;
  ALTER TABLE "pages_blocks_members_organizations" ADD COLUMN "category" varchar;
  ALTER TABLE "pages_blocks_members_organizations" ADD COLUMN "focus" varchar;
  ALTER TABLE "pages_blocks_members_organizations" ADD COLUMN "place" varchar;
  ALTER TABLE "pages_blocks_members_organizations" ADD COLUMN "url" varchar;
  ALTER TABLE "_pages_v_blocks_members_organizations" ADD COLUMN "acronym" varchar;
  ALTER TABLE "_pages_v_blocks_members_organizations" ADD COLUMN "category" varchar;
  ALTER TABLE "_pages_v_blocks_members_organizations" ADD COLUMN "focus" varchar;
  ALTER TABLE "_pages_v_blocks_members_organizations" ADD COLUMN "place" varchar;
  ALTER TABLE "_pages_v_blocks_members_organizations" ADD COLUMN "url" varchar;`)
}
