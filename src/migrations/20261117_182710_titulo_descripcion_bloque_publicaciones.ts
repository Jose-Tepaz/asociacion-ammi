import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_archive" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_archive" ADD COLUMN "description" varchar;
  ALTER TABLE "_pages_v_blocks_archive" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_archive" ADD COLUMN "description" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_archive" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_archive" DROP COLUMN "description";
  ALTER TABLE "_pages_v_blocks_archive" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_archive" DROP COLUMN "description";`)
}
