import type { Block } from 'payload'

export const Intro: Block = {
  slug: 'intro',
  interfaceName: 'IntroBlock',
  labels: { singular: 'Presentación', plural: 'Presentaciones' },
  fields: [
    { name: 'heading', label: 'Título', type: 'text', required: true },
    { name: 'body', label: 'Texto', type: 'textarea', required: true },
    {
      name: 'facts',
      label: 'Datos destacados',
      type: 'array',
      maxRows: 4,
      admin: { description: 'Cifras o datos reales: un año, un número, un lugar.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'value', label: 'Dato', type: 'text', required: true, admin: { width: '40%' } },
            { name: 'label', label: 'Explicación', type: 'text', required: true, admin: { width: '60%' } },
          ],
        },
      ],
    },
    { name: 'image', label: 'Imagen (opcional)', type: 'upload', relationTo: 'media' },
  ],
}
