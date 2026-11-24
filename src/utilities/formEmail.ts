import type { BeforeEmail } from '@payloadcms/plugin-form-builder/types'

import { getServerSideURL } from './getURL'

type SubmissionRow = { field: string; value?: unknown }
type FormField = { name?: string; label?: string | null }

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/** «organizacion» → «Organizacion»; «nombre_completo» → «Nombre completo». */
const capitalize = (text: string): string => {
  const clean = text.replace(/[_-]+/g, ' ').trim()
  return clean.charAt(0).toUpperCase() + clean.slice(1)
}

const isEmail = (text: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)

/**
 * Logo para el correo. Gmail no puede ver imágenes de la computadora local,
 * así que en local se usa el logo del sitio publicado.
 */
const logoURL = (): string => {
  const site = getServerSideURL()
  if (/localhost|127\.0\.0\.1/.test(site)) {
    return 'https://alianzaammi.org/brand/ammi-logo-white.png'
  }
  return `${site}/brand/ammi-logo-correo.png`
}

/** Correo con el diseño de AMMI: encabezado corinto y los datos del formulario en filas. */
const renderEmail = (title: string, rows: { label: string; value: string }[]): string => {
  const body = rows
    .map(({ label, value }) => {
      const safe = escapeHtml(value).replace(/\n/g, '<br>')
      const shown = isEmail(value)
        ? `<a href="mailto:${safe}" style="color:#240f16;text-decoration:underline;text-decoration-color:#e4d3ba;">${safe}</a>`
        : safe
      return `
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid #e4d3ba;">
            <div style="font-size:12px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:#7b1e3a;">${escapeHtml(label)}</div>
            <div style="margin-top:4px;font-size:16px;line-height:1.5;color:#240f16;">${shown || '—'}</div>
          </td>
        </tr>`
    })
    .join('')

  return `<!doctype html>
<html lang="es">
  <body style="margin:0;padding:0;background:#f3e9da;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3e9da;padding:32px 16px;font-family:Helvetica,Arial,sans-serif;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fbf6ee;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="background:#5e1530;padding:28px 32px;">
                <img src="${logoURL()}" width="180" alt="AMMI, Alianza de Mujeres y Mujeres Indígenas por el Acceso a la Justicia" style="display:block;width:180px;max-width:100%;height:auto;border:0;">
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px 8px;">
                <h1 style="margin:0;font-family:Georgia,serif;font-size:22px;line-height:1.3;color:#5e1530;">${escapeHtml(title)}</h1>
                <p style="margin:8px 0 0;font-size:14px;color:#6b5a52;">Alguien escribió desde el formulario del sitio. Para contestar, responde a este correo.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 32px 28px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${body}</table>
              </td>
            </tr>
          </table>
          <p style="margin:16px 0 0;font-size:12px;color:#6b5a52;">Enviado desde el sitio web de AMMI.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

/**
 * Antes de enviar los correos de un formulario:
 * - salen siempre del remitente del sistema (Resend rechaza remitentes no verificados, como Gmail);
 * - el contenido usa el diseño de AMMI, con los nombres de los campos tal como se ven en el formulario.
 */
export const beforeFormEmail: BeforeEmail = async (emails, { data, req }) => {
  const submission = (data?.submissionData || []) as SubmissionRow[]

  let fields: FormField[] = []
  const formID = typeof data?.form === 'object' ? data.form?.id : data?.form
  if (formID) {
    try {
      const form = await req.payload.findByID({ collection: 'forms', id: formID, depth: 0, req })
      fields = (form?.fields || []) as FormField[]
    } catch {
      // Si no se encuentra el formulario se usan los nombres internos de los campos
    }
  }

  const rows = submission.map(({ field, value }) => {
    const label = fields.find((f) => f.name === field)?.label || field
    return { label: capitalize(String(label)), value: value == null ? '' : String(value) }
  })

  return emails.map((email) => ({
    ...email,
    from: '',
    html: renderEmail(email.subject || 'Has recibido un mensaje nuevo', rows),
  }))
}
