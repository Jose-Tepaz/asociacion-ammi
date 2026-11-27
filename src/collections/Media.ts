import type { CollectionBeforeOperationHook, CollectionConfig } from 'payload'

import { APIError } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { MEDIA_CACHE_CONTROL } from '../utilities/directMediaFile'

// Las fotos se guardan en WEBP (mucho más livianas que JPG o PNG) aunque se suban en otro formato.
// Vale para el archivo original y para cada tamaño. Los logos PNG conservan la transparencia.
const WEBP = { format: 'webp' as const, options: { quality: 80 } }

/**
 * Peso máximo (en MB) de cada tipo de archivo al subirlo. Si hay que cambiar un límite, se cambia
 * aquí; la descripción de la colección lo toma de esta lista.
 */
const LIMITES_MB = { imagen: 3, pdf: 20, video: 30, otro: 10 } as const

const tipoDeArchivo = (mimetype: string) => {
  if (mimetype.startsWith('image/')) return { limite: LIMITES_MB.imagen, nombre: 'La imagen' }
  if (mimetype === 'application/pdf') return { limite: LIMITES_MB.pdf, nombre: 'El PDF' }
  if (mimetype.startsWith('video/')) return { limite: LIMITES_MB.video, nombre: 'El video' }
  return { limite: LIMITES_MB.otro, nombre: 'El archivo' }
}

// Evita archivos muy pesados (fotos de cámara de 8 MB, PDF escaneados, videos largos) que hacen
// lento el sitio en celular y gastan transferencia del almacenamiento.
const limitarPesoArchivo: CollectionBeforeOperationHook = ({ operation, req }) => {
  if (operation !== 'create' && operation !== 'update') return
  // Solo para lo que se sube desde el admin. Los scripts (como `pnpm imagenes:optimizar`) usan la
  // API local y necesitan poder reemplazar las fotos pesadas que ya estaban subidas.
  if (req.payloadAPI === 'local') return
  const file = req.file
  if (!file) return
  const { limite, nombre } = tipoDeArchivo(file.mimetype || '')
  if (file.size > limite * 1024 * 1024) {
    const mb = (file.size / 1024 / 1024).toFixed(1)
    throw new APIError(
      `${nombre} pesa ${mb} MB y el límite es ${limite} MB. Reduce su peso y vuelve a intentarlo.`,
      400,
      undefined,
      true,
    )
  }
}

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Imagen o archivo', plural: 'Imágenes y archivos' },
  admin: {
    description:
      'Si reemplazas el archivo de una imagen, cambia en todas las secciones que la usan. Para cambiar la foto de una sola sección, sube una imagen nueva desde esa sección. ' +
      `Peso máximo: imágenes ${LIMITES_MB.imagen} MB, PDF ${LIMITES_MB.pdf} MB, videos ${LIMITES_MB.video} MB y otros documentos ${LIMITES_MB.otro} MB.`,
  },
  folders: true,
  hooks: {
    beforeOperation: [limitarPesoArchivo],
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'alt',
      label: 'Texto alternativo',
      type: 'text',
      admin: { description: 'Describe la imagen en pocas palabras, para personas que usan lector de pantalla.' },
      //required: true,
    },
    {
      name: 'caption',
      label: 'Pie de foto',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
  upload: {
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
    staticDir: path.resolve(dirname, '../../public/media'),
    // Sin esto cada visita vuelve a pedir el archivo al almacenamiento. El navegador lo guarda
    // un día y la red de Vercel 30 días; al reemplazar una imagen su URL cambia (?updatedAt).
    // Las fotos del sitio público salen por /archivos con la misma caché (ver directMediaFile.ts).
    modifyResponseHeaders: ({ headers }) => {
      headers.set('Cache-Control', MEDIA_CACHE_CONTROL)
      return headers
    },
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    // El original se guarda como máximo a 2560 px de lado (sin agrandar las pequeñas) y en WEBP,
    // para que ninguna foto pese varios MB. Solo aplica a imágenes: PDF, video y SVG no se tocan.
    resizeOptions: { width: 2560, height: 2560, fit: 'inside', withoutEnlargement: true },
    formatOptions: WEBP,
    imageSizes: [
      {
        name: 'thumbnail',
        formatOptions: WEBP,
        width: 300,
      },
      {
        name: 'square',
        formatOptions: WEBP,
        width: 500,
        height: 500,
      },
      {
        name: 'small',
        formatOptions: WEBP,
        width: 600,
      },
      {
        name: 'medium',
        formatOptions: WEBP,
        width: 900,
      },
      {
        name: 'large',
        formatOptions: WEBP,
        width: 1400,
      },
      {
        name: 'xlarge',
        formatOptions: WEBP,
        width: 1920,
      },
      {
        name: 'og',
        formatOptions: WEBP,
        width: 1200,
        height: 630,
        crop: 'center',
      },
    ],
  },
}
