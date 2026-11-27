// @vitest-environment node
import { createServer, type Server } from 'node:http'
import type { AddressInfo } from 'node:net'

import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { GET } from '@/app/(frontend)/archivos/[archivo]/route'
import { toDirectFileUrl } from '@/utilities/directMediaFile'
import { getMediaUrl } from '@/utilities/getMediaUrl'

// Nombre con tilde descompuesta, como los que ya hay en producción ("Mujeres en diálogo...")
const NOMBRE = 'Mujeres en diálogo y justicia-600x657.webp'
const CONTENIDO = Buffer.from('imagen-de-prueba')

/** Almacenamiento S3 de mentira: responde como Neon Object Storage (path-style). */
let server: Server
let pedidos: string[] = []
let falla500 = false

beforeAll(async () => {
  server = createServer((req, res) => {
    const key = decodeURIComponent(new URL(req.url!, 'http://s3').pathname.replace(/^\/uploades\//, ''))
    pedidos.push(key)
    if (falla500) {
      res.writeHead(500, { 'Content-Type': 'application/xml' })
      res.end('<?xml version="1.0"?><Error><Code>InternalError</Code><Message>x</Message></Error>')
      return
    }
    if (key !== NOMBRE) {
      res.writeHead(404, { 'Content-Type': 'application/xml' })
      res.end('<?xml version="1.0"?><Error><Code>NoSuchKey</Code><Message>No existe</Message></Error>')
      return
    }
    res.writeHead(200, {
      'Content-Length': CONTENIDO.length,
      'Content-Type': 'image/webp',
      ETag: '"abc123"',
      'Last-Modified': 'Wed, 26 Nov 2026 20:00:00 GMT',
    })
    res.end(CONTENIDO)
  })
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  const { port } = server.address() as AddressInfo

  process.env.S3_ENDPOINT = `http://127.0.0.1:${port}`
  process.env.S3_BUCKET = 'uploades'
  process.env.S3_REGION = 'us-east-1'
  process.env.S3_ACCESS_KEY_ID = 'prueba'
  process.env.S3_SECRET_ACCESS_KEY = 'prueba'
})

afterAll(() => {
  server?.close()
})

beforeEach(() => {
  pedidos = []
  falla500 = false
})

const pedir = (ruta: string) => GET(new Request(`https://alianzaammi.org${ruta}`))

describe('direcciones de las imágenes', () => {
  it('manda las imágenes de Payload a /archivos', () => {
    expect(toDirectFileUrl('/api/media/file/foto-600x400.webp')).toBe('/archivos/foto-600x400.webp')
    expect(toDirectFileUrl('/api/media/file/Logo.PNG?2026-11-05')).toBe('/archivos/Logo.PNG?2026-11-05')
    expect(toDirectFileUrl('https://alianzaammi.org/api/media/file/og-1200x630.jpg')).toBe(
      'https://alianzaammi.org/archivos/og-1200x630.jpg',
    )
  })

  it('deja igual PDF, video, SVG y archivos que no son de Media', () => {
    for (const url of [
      '/api/media/file/informe.pdf',
      '/api/media/file/video.mp4',
      '/api/media/file/logo.svg',
      '/brand/ammi-logo-white.png',
      '/media/foto.jpg',
    ]) {
      expect(toDirectFileUrl(url)).toBe(url)
    }
  })

  it('getMediaUrl agrega la marca de caché a la dirección directa', () => {
    expect(getMediaUrl('/api/media/file/foto.webp', '2026-11-26T20:24:54.000Z')).toBe(
      '/archivos/foto.webp?2026-11-26T20%3A24%3A54.000Z',
    )
    expect(getMediaUrl('/api/media/file/informe.pdf', '2026')).toBe('/api/media/file/informe.pdf?2026')
    expect(getMediaUrl(null)).toBe('')
  })
})

describe('ruta /archivos', () => {
  it('entrega la imagen del almacenamiento con caché larga', async () => {
    const res = await pedir(`/archivos/${encodeURIComponent(NOMBRE)}?2026-11-13T15%3A38%3A53.926Z`)

    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toBe('image/webp')
    expect(res.headers.get('Cache-Control')).toBe(
      'public, max-age=86400, s-maxage=2592000, stale-while-revalidate=86400',
    )
    expect(res.headers.get('ETag')).toBe('"abc123"')
    expect(res.headers.get('X-Content-Type-Options')).toBe('nosniff')
    expect(Buffer.from(await res.arrayBuffer())).toEqual(CONTENIDO)
    expect(pedidos).toEqual([NOMBRE])
  })

  it('responde 404 sin caché si el archivo no existe', async () => {
    const res = await pedir('/archivos/no-existe.webp')
    expect(res.status).toBe(404)
    expect(res.headers.get('Cache-Control')).toBe('no-store')
  })

  it('responde 502 sin caché si el almacenamiento falla', async () => {
    falla500 = true
    const res = await pedir(`/archivos/${encodeURIComponent(NOMBRE)}`)
    expect(res.status).toBe(502)
    expect(res.headers.get('Cache-Control')).toBe('no-store')
  })

  it('rechaza otros formatos y rutas raras sin tocar el almacenamiento', async () => {
    for (const ruta of [
      '/archivos/logo.svg',
      '/archivos/informe.pdf',
      '/archivos/..%2Fsecreto.png',
      '/archivos/carpeta%2Ffoto.png',
      '/archivos/carpeta%5Cfoto.png',
      '/archivos/sin-extension',
      '/archivos/%E0%A4%A.png',
    ]) {
      const res = await pedir(ruta)
      expect(res.status, ruta).toBe(404)
    }
    expect(pedidos).toEqual([])
  })

  it('sin almacenamiento (SQLite) manda a la dirección de Payload', async () => {
    const endpoint = process.env.S3_ENDPOINT
    delete process.env.S3_ENDPOINT
    try {
      const res = await pedir('/archivos/Mujeres%20en%20dia%CC%81logo.webp?2026')
      expect(res.status).toBe(307)
      expect(res.headers.get('Location')).toBe(
        'https://alianzaammi.org/api/media/file/Mujeres%20en%20dia%CC%81logo.webp?2026',
      )
    } finally {
      process.env.S3_ENDPOINT = endpoint
    }
  })
})
