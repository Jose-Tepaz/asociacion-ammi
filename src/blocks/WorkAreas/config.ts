import type { Block } from 'payload'

import { optionalLink } from '@/fields/optionalLink'

export const WorkAreas: Block = {
  slug: 'workAreas',
  interfaceName: 'WorkAreasBlock',
  labels: { singular: 'Líneas de trabajo', plural: 'Líneas de trabajo' },
  fields: [
    { name: 'heading', label: 'Título', type: 'text', required: true },
    { name: 'subheading', label: 'Subtítulo', type: 'text' },
    optionalLink('allLink', 'Botón «ver todos»'),
    {
      name: 'items',
      label: 'Líneas',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      fields: [
        { name: 'title', label: 'Nombre', type: 'text', required: true },
        { name: 'summary', label: 'Descripción', type: 'textarea', required: true },
        {
          name: 'image',
          label: 'Imagen',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Solo se muestra en la primera línea. Para cambiar solo esta sección, elige o sube otra imagen aquí. No reemplaces el archivo desde «Medios»: cambiaría en todas las secciones que usen esa misma imagen.' },
        },
        { name: 'linkLabel', label: 'Texto del enlace', type: 'text', defaultValue: 'Conocer más' },
        { name: 'url', label: 'Enlace', type: 'text', admin: { placeholder: '/lineas/participacion' } },
      ],
    },
  ],
}
