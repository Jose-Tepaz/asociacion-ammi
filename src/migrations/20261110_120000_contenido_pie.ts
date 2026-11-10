import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Carga el contenido del pie de página: redes sociales, teléfono, WhatsApp y la línea legal.
 *
 * Solo cambia datos, no el esquema. Es segura sobre contenido existente:
 * - agrega las redes solo si no hay ninguna;
 * - agrega teléfono y WhatsApp solo si no hay un contacto con `tel:` o `wa.me`;
 * - cambia la línea legal solo si todavía menciona a Moloj como administradora.
 */

const LEGAL_ANTERIOR = 'Alianza administrada por la Asociación Política de Mujeres Mayas, Moloj.'
const LEGAL_NUEVA = 'Alianza de Mujeres y Mujeres Indígenas por el Acceso a la Justicia.'

// Ids fijos para que `down` borre solo lo que agregó esta migración
const REDES = [
  { id: '6b1f0a000000000000000001', label: 'Facebook', url: 'https://www.facebook.com/alianzammi' },
  { id: '6b1f0a000000000000000002', label: 'Instagram', url: 'https://www.instagram.com/alianzammi' },
  { id: '6b1f0a000000000000000003', label: 'YouTube', url: 'https://www.youtube.com/@alianzaAMMI' },
]
// Números de prueba: se cambian en el admin cuando AMMI confirme los reales
const CONTACTOS = [
  { id: '6b1f0b000000000000000001', label: '+502 0000-0000', href: 'tel:+50200000000' },
  { id: '6b1f0b000000000000000002', label: 'WhatsApp', href: 'https://wa.me/50200000000' },
]
const IDS = [...REDES, ...CONTACTOS].map(({ id }) => id)

export async function up({ db }: MigrateUpArgs): Promise<void> {
  const footer = await db.execute(sql`SELECT "id" FROM "footer" ORDER BY "id" LIMIT 1;`)
  const footerId = footer.rows[0]?.id as number | undefined
  // Si el pie nunca se guardó no hay fila a la que colgar el contenido
  if (footerId === undefined) return

  const redes = await db.execute(
    sql`SELECT 1 FROM "footer_social_links" WHERE "_parent_id" = ${footerId} LIMIT 1;`,
  )
  if (redes.rows.length === 0) {
    for (const [i, red] of REDES.entries()) {
      await db.execute(sql`
        INSERT INTO "footer_social_links" ("_order", "_parent_id", "id", "label", "url")
        VALUES (${i + 1}, ${footerId}, ${red.id}, ${red.label}, ${red.url});`)
    }
  }

  const telefono = await db.execute(sql`
    SELECT 1 FROM "footer_contacts"
    WHERE "_parent_id" = ${footerId} AND ("href" LIKE 'tel:%' OR "href" LIKE '%wa.me%')
    LIMIT 1;`)
  if (telefono.rows.length === 0) {
    const ultimo = await db.execute(sql`
      SELECT COALESCE(MAX("_order"), 0) AS "orden" FROM "footer_contacts"
      WHERE "_parent_id" = ${footerId} AND "href" IS NOT NULL AND "href" <> '';`)
    const desde = Number(ultimo.rows[0]?.orden ?? 0)
    // Las direcciones (sin enlace) se corren al final, después del teléfono y WhatsApp
    await db.execute(sql`
      UPDATE "footer_contacts" SET "_order" = "_order" + ${CONTACTOS.length}
      WHERE "_parent_id" = ${footerId} AND ("href" IS NULL OR "href" = '');`)
    for (const [i, contacto] of CONTACTOS.entries()) {
      await db.execute(sql`
        INSERT INTO "footer_contacts" ("_order", "_parent_id", "id", "label", "href")
        VALUES (${desde + i + 1}, ${footerId}, ${contacto.id}, ${contacto.label}, ${contacto.href});`)
    }
  }

  await db.execute(sql`
    UPDATE "footer" SET "legal" = ${LEGAL_NUEVA}
    WHERE "id" = ${footerId} AND "legal" ILIKE '%Moloj%';`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const id of IDS) {
    await db.execute(sql`DELETE FROM "footer_social_links" WHERE "id" = ${id};`)
    await db.execute(sql`DELETE FROM "footer_contacts" WHERE "id" = ${id};`)
  }
  await db.execute(sql`UPDATE "footer" SET "legal" = ${LEGAL_ANTERIOR} WHERE "legal" = ${LEGAL_NUEVA};`)
}
