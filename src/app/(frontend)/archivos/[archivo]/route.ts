import { GetObjectCommand, NoSuchKey, S3Client, S3ServiceException } from '@aws-sdk/client-s3'

import {
  DIRECT_FILE_PATH,
  MEDIA_CACHE_CONTROL,
  PAYLOAD_FILE_PATH,
  getDirectFileType,
} from '@/utilities/directMediaFile'

/**
 * Entrega las imágenes de Media directo del almacenamiento (Neon Object Storage), sin arrancar
 * Payload ni consultar la base. Así una imagen que Vercel aún no tiene en caché no enciende la base,
 * y las fotos siguen cargando aunque la base esté lenta o caída. Ver `utilities/directMediaFile.ts`.
 *
 * Solo entrega imágenes (JPG, PNG, WEBP, GIF, AVIF) que estén en la raíz del bucket, que es donde
 * Payload las guarda. Son las mismas que ya son públicas en `/api/media/file/`.
 */

let client: S3Client | undefined

const getClient = () => {
  client ??= new S3Client({
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION,
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    },
  })
  return client
}

const respuesta = (status: number, texto: string) =>
  new Response(texto, {
    status,
    headers: { 'Cache-Control': 'no-store', 'Content-Type': 'text/plain; charset=utf-8' },
  })

export async function GET(request: Request): Promise<Response> {
  const { pathname, search } = new URL(request.url)
  const encodedName = pathname.slice(DIRECT_FILE_PATH.length)

  let filename: string
  try {
    filename = decodeURIComponent(encodedName)
  } catch {
    return respuesta(404, 'No encontrado')
  }

  const contentType = getDirectFileType(filename)
  if (!contentType || /[/\\]/.test(filename) || filename.includes('..')) {
    return respuesta(404, 'No encontrado')
  }

  // Sin almacenamiento (SQLite en la computadora) los archivos están en public/media y los entrega Payload
  if (!process.env.S3_ENDPOINT) {
    return Response.redirect(new URL(`${PAYLOAD_FILE_PATH}${encodedName}${search}`, request.url), 307)
  }

  try {
    const object = await getClient().send(
      new GetObjectCommand({ Bucket: process.env.S3_BUCKET, Key: filename }),
    )
    if (!object.Body) return respuesta(404, 'No encontrado')

    const headers = new Headers({
      'Cache-Control': MEDIA_CACHE_CONTROL,
      'Content-Type': contentType,
      'X-Content-Type-Options': 'nosniff',
    })
    if (object.ContentLength !== undefined) headers.set('Content-Length', String(object.ContentLength))
    if (object.ETag) headers.set('ETag', object.ETag)
    if (object.LastModified) headers.set('Last-Modified', object.LastModified.toUTCString())

    return new Response(object.Body.transformToWebStream(), { headers })
  } catch (error) {
    if (
      error instanceof NoSuchKey ||
      (error instanceof S3ServiceException && error.$metadata.httpStatusCode === 404)
    ) {
      return respuesta(404, 'No encontrado')
    }
    console.error(`No se pudo leer ${filename} del almacenamiento`, error)
    return respuesta(502, 'No se pudo cargar la imagen')
  }
}
