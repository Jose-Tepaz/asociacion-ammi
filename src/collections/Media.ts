import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

// Las fotos se guardan en WEBP (mucho más livianas que JPG o PNG) aunque se suban en otro formato.
// Vale para el archivo original y para cada tamaño. Los logos PNG conservan la transparencia.
const WEBP = { format: 'webp' as const, options: { quality: 80 } }

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Imagen o archivo', plural: 'Imágenes y archivos' },
  admin: {
    description:
      'Si reemplazas el archivo de una imagen, cambia en todas las secciones que la usan. Para cambiar la foto de una sola sección, sube una imagen nueva desde esa sección.',
  },
  folders: true,
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
    modifyResponseHeaders: ({ headers }) => {
      headers.set('Cache-Control', 'public, max-age=86400, s-maxage=2592000, stale-while-revalidate=86400')
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
