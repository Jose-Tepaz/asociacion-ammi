import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_footer_contacts_type" AS ENUM('email', 'phone', 'whatsapp', 'address', 'contact', 'link');
  ALTER TABLE "footer_contacts" ADD COLUMN "type" "enum_footer_contacts_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "footer_contacts" DROP COLUMN "type";
  DROP TYPE "public"."enum_footer_contacts_type";`)
}
