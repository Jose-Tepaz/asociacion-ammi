/**
 * Imágenes servidas directo del almacenamiento, sin pasar por Payload.
 *
 * Payload entrega los archivos de Media en `/api/media/file/<nombre>`. Para hacerlo arranca y se
 * conecta a la base, así que cada imagen que Vercel aún no tiene en caché enciende la base de Neon
 * (y si la base no responde, la imagen no carga). Las fotos del sitio público usan en cambio
 * `/archivos/<nombre>` (ver `app/(frontend)/archivos/[archivo]/route.ts`), que las lee directo del
 * almacenamiento. El admin sigue usando la dirección de Payload.
 */

/** Dirección con la que Payload entrega los archivos de Media. */
export const PAYLOAD_FILE_PATH = '/api/media/file/'

/** Ruta propia que entrega las imágenes directo del almacenamiento. */
export const DIRECT_FILE_PATH = '/archivos/'

/**
 * Caché de los archivos de Media. El navegador los guarda un día y la red de Vercel 30 días; al
 * reemplazar una imagen su URL cambia (lleva `?updatedAt`), así que nunca se ve una versión vieja.
 */
export const MEDIA_CACHE_CONTROL =
  'public, max-age=86400, s-maxage=2592000, stale-while-revalidate=86400'

/**
 * Formatos que se entregan por la ruta directa. SVG queda fuera porque puede llevar código, y PDF y
 * video siguen por Payload (los videos necesitan descargas por partes).
 */
const DIRECT_FILE_TYPES: Record<string, string> = {
  avif: 'image/avif',
  gif: 'image/gif',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
}

/** Tipo de contenido de una imagen que se puede entregar directo, o `undefined` si no se puede. */
export const getDirectFileType = (filename: string): string | undefined => {
  const dot = filename.lastIndexOf('.')
  if (dot === -1) return undefined
  return DIRECT_FILE_TYPES[filename.slice(dot + 1).toLowerCase()]
}

const PAYLOAD_FILE_URL = /^((?:https?:\/\/[^/]+)?)\/api\/media\/file\/([^?#/]+)(.*)$/

/**
 * Cambia `/api/media/file/<nombre>` por `/archivos/<nombre>` si es una imagen que se puede entregar
 * directo. Cualquier otra dirección (PDF, video, SVG, archivos de `public/`) queda igual.
 */
export const toDirectFileUrl = (url: string): string => {
  const match = url.match(PAYLOAD_FILE_URL)
  if (!match) return url

  const [, origin = '', filename = '', rest = ''] = match
  if (!getDirectFileType(filename)) return url

  return `${origin}${DIRECT_FILE_PATH}${filename}${rest}`
}
