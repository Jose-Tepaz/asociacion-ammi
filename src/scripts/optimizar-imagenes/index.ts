/**
 * Vuelve a guardar las fotos que ya están en "Imágenes y archivos" para que queden en WEBP,
 * con un máximo de 2560 px y con todos sus tamaños regenerados (ver `upload` en
 * `collections/Media.ts`). Las fotos nuevas ya se guardan así al subirlas; esto es solo para
 * las que se subieron antes del cambio.
 *
 * Cada foto se reemplaza en su mismo registro: conserva su texto alternativo, su punto focal y
 * todas las secciones y publicaciones que la usan. Solo cambia el archivo (y su nombre a .webp).
 * PDF, videos, SVG y GIF no se tocan.
 *
 * ORIGEN es la dirección desde donde se descargan los originales (el sitio que usa esta base):
 *
 *   Vista previa, no escribe nada:
 *     ORIGEN=http://localhost:3000 pnpm imagenes:optimizar
 *   Aplicar:
 *     ORIGEN=http://localhost:3000 pnpm imagenes:optimizar:aplicar
 */
import type { Media } from '@/payload-types'

import config from '@payload-config'
import { getPayload } from 'payload'

// Sin esta variable, Payload intentaría cambiar el esquema de la base al conectarse
if (process.env.PAYLOAD_MIGRATING !== 'true') {
  throw new Error('Ejecuta este script con: pnpm imagenes:optimizar')
}

const ORIGEN = process.env.ORIGEN?.replace(/\/$/, '')
if (!ORIGEN) {
  throw new Error('Falta ORIGEN, por ejemplo: ORIGEN=http://localhost:3000')
}

const APLICAR = process.env.APLICAR === 'true'

/** Formatos que se convierten. GIF queda fuera para no perder animaciones. */
const CONVERTIBLES = ['image/jpeg', 'image/png', 'image/webp', 'image/tiff', 'image/avif']
const MAX_LADO = 2560
const PESO_OK = 1_000_000

const mb = (bytes: number) => `${(bytes / 1_000_000).toFixed(2)} MB`

/** Una foto ya está bien si es WEBP, pesa menos de 1 MB, no pasa de 2560 px y tiene tamaños WEBP. */
const yaOptimizada = (doc: Media) => {
  const tamañosEnWebp = Object.values(doc.sizes || {}).every(
    (size) => !size?.url || size.mimeType === 'image/webp',
  )
  return (
    doc.mimeType === 'image/webp' &&
    (doc.filesize || 0) < PESO_OK &&
    Math.max(doc.width || 0, doc.height || 0) <= MAX_LADO &&
    tamañosEnWebp
  )
}

const optimizar = async () => {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 0,
    pagination: false,
  })

  const pendientes = docs.filter(
    (doc) => doc.url && doc.mimeType && CONVERTIBLES.includes(doc.mimeType) && !yaOptimizada(doc),
  )

  const total = pendientes.reduce((sum, doc) => sum + (doc.filesize || 0), 0)
  console.log(`${docs.length} archivos en la biblioteca; ${pendientes.length} fotos por optimizar (${mb(total)} en originales)`)
  for (const doc of pendientes) {
    console.log(`  · ${doc.filename}  ${doc.mimeType}  ${doc.width}×${doc.height}  ${mb(doc.filesize || 0)}`)
  }

  if (!APLICAR) {
    console.log('\nVista previa: no se cambió nada. Para aplicar usa pnpm imagenes:optimizar:aplicar')
    return
  }

  let antes = 0
  let despues = 0
  const fallidas: string[] = []

  for (const doc of pendientes) {
    try {
      const respuesta = await fetch(`${ORIGEN}${doc.url}`)
      if (!respuesta.ok) throw new Error(`descarga respondió ${respuesta.status}`)
      const data = Buffer.from(await respuesta.arrayBuffer())
      if (doc.filesize && data.length !== doc.filesize) {
        throw new Error(`el archivo descargado pesa ${data.length} B y se esperaban ${doc.filesize} B`)
      }

      const actualizado = await payload.update({
        collection: 'media',
        id: doc.id,
        // Se repiten para que el reemplazo no los reinicie
        data: { alt: doc.alt, focalX: doc.focalX, focalY: doc.focalY },
        file: { data, mimetype: doc.mimeType!, name: doc.filename!, size: data.length },
        context: { disableRevalidate: true },
      })

      antes += doc.filesize || 0
      despues += actualizado.filesize || 0
      console.log(`  ✓ ${doc.filename} → ${actualizado.filename}  ${mb(doc.filesize || 0)} → ${mb(actualizado.filesize || 0)}`)
    } catch (err) {
      fallidas.push(doc.filename || String(doc.id))
      console.error(`  ✗ ${doc.filename}: ${err instanceof Error ? err.message : err}`)
    }
  }

  console.log(`\nListo: ${mb(antes)} → ${mb(despues)} en originales.`)
  if (fallidas.length) {
    console.log(`No se pudieron optimizar (${fallidas.length}): ${fallidas.join(', ')}. Se puede volver a correr.`)
    process.exitCode = 1
  }
}

// `payload run` termina al evaluar el módulo, así que esperamos aquí
await optimizar().catch((err) => {
  console.error(err)
  process.exit(1)
})
