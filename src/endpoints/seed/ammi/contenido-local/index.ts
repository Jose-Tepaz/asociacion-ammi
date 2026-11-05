/**
 * Copia a otra base el contenido que se editó en local: la página de Ejes, los logos,
 * dos imágenes del inicio y los enlaces hacia /ejes.
 *
 * Vista previa, no escribe nada:  pnpm seed:contenido
 * Aplicar los cambios:            pnpm seed:contenido:aplicar
 *
 * Usa la base y el almacenamiento de las variables de entorno activas. Solo toca los campos
 * listados aquí y se puede repetir sin duplicar nada: las imágenes se buscan por nombre de
 * archivo y la página por su slug.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from '@payload-config'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const apply = process.env.APLICAR === 'true'
const ctx = { disableRevalidate: true }

const content = JSON.parse(fs.readFileSync(path.join(dirname, 'contenido.json'), 'utf8'))

const mimeTypes: Record<string, string> = {
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
}

/** Muestra a qué base se conecta, sin usuario ni contraseña. */
const databaseHost = () => {
  const url = process.env.DATABASE_URL || ''
  if (!url.startsWith('postgres')) return url
  return new URL(url).host
}

/** Cambia `{ $media: 'archivo' }` por el id de la imagen en la base de destino. */
const resolveMedia = (value: unknown, ids: Map<string, number | string>): unknown => {
  if (Array.isArray(value)) return value.map((item) => resolveMedia(item, ids))
  if (!value || typeof value !== 'object') return value

  const record = value as Record<string, unknown>
  if (typeof record.$media === 'string') return ids.get(record.$media)

  return Object.fromEntries(
    Object.entries(record).map(([key, item]) => [key, resolveMedia(item, ids)]),
  )
}

const run = async () => {
  // Sin esta variable, Payload intentaría cambiar el esquema de la base al conectarse
  if (process.env.PAYLOAD_MIGRATING !== 'true') {
    throw new Error('Ejecuta este script con: pnpm seed:contenido')
  }

  const payload = await getPayload({ config })
  const log = (message: string) => console.log(message)

  log(`\nBase de destino: ${databaseHost()}`)
  log(`Almacenamiento: ${process.env.S3_ENDPOINT ? 'S3' : 'carpeta local'}`)
  log(apply ? 'Modo: APLICAR\n' : 'Modo: vista previa, no se escribirá nada\n')

  // --- Imágenes -----------------------------------------------------------------------
  const ids = new Map<string, number | string>()
  for (const [filename, { alt }] of Object.entries<{ alt: string }>(content.media)) {
    const found = await payload.find({
      collection: 'media',
      limit: 1,
      where: { filename: { equals: filename } },
    })

    if (found.docs[0]) {
      ids.set(filename, found.docs[0].id)
      log(`Imagen ya existe: ${filename}`)
      continue
    }

    log(`Imagen nueva: ${filename}`)
    if (!apply) continue

    const data = fs.readFileSync(path.join(dirname, 'archivos', filename))
    const created = await payload.create({
      collection: 'media',
      context: ctx,
      data: { alt },
      file: {
        data,
        mimetype: mimeTypes[path.extname(filename).toLowerCase()],
        name: filename,
        size: data.length,
      },
    })
    ids.set(filename, created.id)
  }

  // --- Página de Ejes -----------------------------------------------------------------
  const existing = await payload.find({
    collection: 'pages',
    depth: 0,
    limit: 1,
    where: { slug: { equals: content.ejes.slug } },
  })
  log(`\nPágina /${content.ejes.slug}: ${existing.docs[0] ? 'se actualizará' : 'se creará'}`)

  if (apply) {
    const data = { ...(resolveMedia(content.ejes, ids) as object), _status: 'published' as const }
    if (existing.docs[0]) {
      await payload.update({
        collection: 'pages',
        context: ctx,
        data,
        id: existing.docs[0].id,
      })
    } else {
      await payload.create({ collection: 'pages', context: ctx, data: data as never })
    }
  }

  // --- Inicio -------------------------------------------------------------------------
  const homeResult = await payload.find({
    collection: 'pages',
    depth: 0,
    limit: 1,
    where: { slug: { equals: 'home' } },
  })
  const home = homeResult.docs[0]
  if (!home) throw new Error('No se encontró la página de inicio.')

  const intro = home.layout.find((block) => block.blockType === 'intro')
  const workAreas = home.layout.find((block) => block.blockType === 'workAreas')
  if (!intro || !workAreas) throw new Error('El inicio no tiene los bloques esperados.')

  log('Inicio: imagen de portada, imagen de introducción y enlaces de los ejes')

  if (apply) {
    const layout = home.layout.map((block) => {
      if (block === intro) {
        return { ...block, image: resolveMedia(content.home.introImage, ids) }
      }
      if (block === workAreas) {
        return {
          ...block,
          items: workAreas.items?.map((item, index) => ({
            ...item,
            url: content.home.workAreaUrls[index] ?? item.url,
          })),
        }
      }
      return block
    })

    await payload.update({
      collection: 'pages',
      context: ctx,
      data: {
        _status: 'published',
        hero: { ...home.hero, media: resolveMedia(content.home.heroMedia, ids) as number },
        layout: layout as typeof home.layout,
      },
      id: home.id,
    })
  }

  // --- Encabezado y pie ---------------------------------------------------------------
  for (const slug of ['header', 'footer'] as const) {
    const global = await payload.findGlobal({ depth: 0, slug })
    log(`${slug === 'header' ? 'Encabezado' : 'Pie de página'}: logo y enlace a /ejes`)

    if (!apply) continue

    await payload.updateGlobal({
      context: ctx,
      data: {
        logo: resolveMedia(content[slug].logo, ids) as number,
        navItems: global.navItems?.map((item) =>
          item.link.url === '/#ejes' ? { ...item, link: { ...item.link, url: '/ejes' } } : item,
        ),
      },
      depth: 0,
      slug,
    })
  }

  log(apply ? '\nListo: contenido copiado.' : '\nVista previa terminada: no se cambió nada.')
}

// `payload run` termina al evaluar el módulo, así que esperamos aquí
await run().catch((err) => {
  console.error(err)
  process.exit(1)
})
