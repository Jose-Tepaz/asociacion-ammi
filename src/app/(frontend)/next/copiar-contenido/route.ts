import config from '@payload-config'
import { getPayload } from 'payload'

import { copyContent } from '@/endpoints/seed/ammi/contenido-local/copiar'

export const maxDuration = 300

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const page = (lines: string[], showButton: boolean, status = 200) =>
  new Response(
    `<!doctype html><html lang="es"><meta charset="utf-8"><title>Copiar contenido</title>
    <body style="font-family:system-ui;max-width:48rem;margin:2rem auto;padding:0 1rem">
    <h1>Copiar contenido</h1>
    <pre style="white-space:pre-wrap">${escapeHtml(lines.join('\n'))}</pre>
    ${showButton ? '<form method="post"><button style="padding:.75rem 1.25rem">Aplicar cambios</button></form>' : ''}
    </body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' }, status },
  )

const run = async (request: Request, apply: boolean) => {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })

  if (!user) return page(['Inicia sesión en /admin y vuelve a abrir esta página.'], false, 403)

  const lines: string[] = []
  try {
    await copyContent({ apply, log: (line) => lines.push(line), payload })
    return page(lines, !apply)
  } catch (err) {
    payload.logger.error({ err, msg: 'Error al copiar el contenido' })
    const message = err instanceof Error ? err.message : 'Error desconocido'
    return page([...lines, '', `Error: ${message}`], false, 500)
  }
}

/** Vista previa: no escribe nada. */
export const GET = (request: Request) => run(request, false)

/** Aplica la copia. Solo para personas con sesión en el admin. */
export const POST = (request: Request) => run(request, true)
