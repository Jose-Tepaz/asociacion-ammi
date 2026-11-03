import type { Block } from 'payload'

export const WorkAreas: Block = {
  slug: 'workAreas',
  interfaceName: 'WorkAreasBlock',
  labels: { singular: 'Líneas de trabajo', plural: 'Líneas de trabajo' },
  fields: [
    { name: 'heading', label: 'Título', type: 'text', required: true },
    {
      name: 'items',
      label: 'Líneas',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      fields: [
        { name: 'title', label: 'Nombre', type: 'text', required: true },
        { name: 'summary', label: 'Descripción', type: 'textarea', required: true },
        { name: 'image', label: 'Imagen', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
