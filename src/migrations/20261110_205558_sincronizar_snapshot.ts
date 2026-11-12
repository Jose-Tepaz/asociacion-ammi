import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

// Migración vacía: no cambia la base. Solo trae una «foto» (.json) correcta del esquema.
//
// 20261110_144805_quitar_campos_organizaciones y 20261110_162917_varias_voces_fuente_e_iconos
// se generaron en ramas separadas, así que el .json de la segunda (la más reciente) todavía
// incluía las 5 columnas de Organizaciones que la primera ya borró. Con esa foto, cada
// `payload migrate:create` nuevo volvía a escribir esos 10 DROP COLUMN, que fallarían en
// producción. Esta migración no ejecuta nada; su .json refleja el esquema real después de las dos.
export async function up(_args: MigrateUpArgs): Promise<void> {}

export async function down(_args: MigrateDownArgs): Promise<void> {}
