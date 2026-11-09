import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// «Pueblos y orígenes» deja de ser una lista y pasa a ser una sola línea de texto.
// Las filas que ya existen toman la frase por defecto.
// Organizaciones suma una etiqueta sobre el título («Alianza»).
//
// Solo agrega columnas. Las tablas de la lista anterior de pueblos
// (pages_blocks_statement_peoples y _pages_v_blocks_statement_peoples) se quedan en la base
// sin uso, para no perder lo que haya en producción; se limpiarán después, cuando se decida.
// Ojo: el .json de esta migración ya no las incluye, así que la próxima migración que genere
// Payload va a proponer borrarlas (DROP TABLE). Hay que quitar ese DROP a mano.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_statement" ADD COLUMN "peoples_line" varchar DEFAULT 'Somos mayas, garífunas, xinkas, afrodescendientes, mestizas y ladinas, en una sola alianza.';
  ALTER TABLE "_pages_v_blocks_statement" ADD COLUMN "peoples_line" varchar DEFAULT 'Somos mayas, garífunas, xinkas, afrodescendientes, mestizas y ladinas, en una sola alianza.';
  ALTER TABLE "pages_blocks_members" ADD COLUMN "kicker" varchar DEFAULT 'Alianza';
  ALTER TABLE "_pages_v_blocks_members" ADD COLUMN "kicker" varchar DEFAULT 'Alianza';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_members" DROP COLUMN "kicker";
  ALTER TABLE "_pages_v_blocks_members" DROP COLUMN "kicker";
  ALTER TABLE "pages_blocks_statement" DROP COLUMN "peoples_line";
  ALTER TABLE "_pages_v_blocks_statement" DROP COLUMN "peoples_line";`)
}
