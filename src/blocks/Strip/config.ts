import type { Block } from 'payload'

export const Strip: Block = {
  slug: 'strip',
  interfaceName: 'StripBlock',
  labels: { singular: 'Franja de imágenes', plural: 'Franjas de imágenes' },
  fields: [
    { name: 'heading', label: 'Título', type: 'text', required: true },
    { name: 'panelTitle', label: 'Texto sobre la primera imagen', type: 'text' },
    {
      name: 'images',
      label: 'Imágenes',
      type: 'array',
      minRows: 2,
      maxRows: 4,
      fields: [{ name: 'image', label: 'Imagen', type: 'upload', relationTo: 'media', required: true }],
    },
    { name: 'caption', label: 'Pie de foto', type: 'text' },
  ],
}
