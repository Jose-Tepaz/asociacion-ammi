import type { Field } from 'payload'

/* Ajustes del admin para Formularios y Respuestas de formularios (plugin form-builder). */

type AnyField = Field & { name?: string; fields?: Field[] }

/** Recorre los campos (también dentro de filas) y cambia los que se indiquen por nombre. */
const patchFields = (fields: Field[], patches: Record<string, (field: AnyField) => Field>): Field[] =>
  fields.map((field) => {
    const f = field as AnyField
    const patched = f.name && patches[f.name] ? (patches[f.name](f) as AnyField) : f
    if (patched.fields) {
      return { ...patched, fields: patchFields(patched.fields, patches) } as Field
    }
    return patched as Field
  })

const withAdmin = (field: AnyField, admin: Record<string, unknown>, extra: Record<string, unknown> = {}) =>
  ({ ...field, ...extra, admin: { ...(field as { admin?: object }).admin, ...admin } }) as Field

/**
 * Formularios: la sección de correos va arriba, justo después del nombre, con textos más claros.
 * «Correo electrónico de» y «Mensaje» se ocultan porque el sitio ya usa su propio remitente y su
 * propio diseño de correo (src/utilities/formEmail.ts).
 */
export const arrangeFormFields = (fields: Field[]): Field[] => {
  const patched = patchFields(fields, {
    emails: (f) =>
      withAdmin(
        f,
        {
          description:
            'Cuando alguien envía este formulario, llega un aviso con sus datos a estos correos. Para varios correos, sepáralos con comas.',
          initCollapsed: false,
        },
        {
          label: 'Avisos por correo',
          labels: { singular: 'Aviso por correo', plural: 'Avisos por correo' },
        },
      ),
    emailTo: (f) =>
      withAdmin(f, { description: 'A qué correo llegan los mensajes.' }, { label: 'Enviar a' }),
    // Copias: no hacen falta, en «Enviar a» se pueden poner varios correos separados por comas
    cc: (f) => withAdmin(f, { hidden: true }),
    bcc: (f) => withAdmin(f, { hidden: true }),
    replyTo: (f) =>
      withAdmin(
        f,
        { description: 'Déjalo en {{email}}: así, al responder el aviso, le contestas a la persona que escribió.' },
        { label: 'Responder a' },
      ),
    emailFrom: (f) => withAdmin(f, { hidden: true }),
    subject: (f) => withAdmin(f, {}, { label: 'Asunto del aviso' }),
    message: (f) => withAdmin(f, { hidden: true }),
  })

  // Orden: nombre, avisos por correo y después lo demás
  const byName = (name: string) => patched.find((f) => (f as AnyField).name === name)
  const title = byName('title')
  const emails = byName('emails')
  const rest = patched.filter((f) => f !== title && f !== emails)
  return [title, emails, ...rest].filter(Boolean) as Field[]
}

/** Columna de la lista que muestra un dato de la respuesta (no se guarda en la base). */
const listColumn = (name: string, label: string, cell: string): Field => ({
  name,
  label,
  type: 'ui',
  admin: {
    components: {
      Cell: `@/components/AdminSubmissionCells#${cell}`,
    },
  },
})

/** Respuestas de formularios: en español, con columnas legibles y cada fila como «Campo: respuesta». */
export const arrangeSubmissionFields = (fields: Field[]): Field[] => [
  listColumn('nombre', 'Nombre', 'NameCell'),
  listColumn('correo', 'Correo', 'EmailCell'),
  listColumn('mensaje', 'Mensaje', 'MessageCell'),
  ...patchFields(fields, {
    form: (f) => withAdmin(f, {}, { label: 'Formulario' }),
    submissionData: (f) =>
      withAdmin(
        f,
        {
          components: {
            RowLabel: '@/components/AdminSubmissionRowLabel#SubmissionRowLabel',
          },
          initCollapsed: true,
        },
        { label: 'Datos enviados', labels: { singular: 'Dato', plural: 'Datos' } },
      ),
    field: (f) => withAdmin(f, {}, { label: 'Campo' }),
    value: (f) => withAdmin(f, {}, { label: 'Respuesta' }),
    submissionUploads: (f) => withAdmin(f, {}, { label: 'Archivos enviados' }),
  }),
]
