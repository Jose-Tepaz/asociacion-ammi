import type { Block } from 'payload'

export const Quote: Block = {
  slug: 'quote',
  interfaceName: 'QuoteBlock',
  labels: { singular: 'Voz (cita)', plural: 'Voces (citas)' },
  fields: [
    { name: 'quote', label: 'Cita', type: 'textarea', required: true, admin: { description: 'Hasta unas 25 palabras.' } },
    {
      type: 'row',
      fields: [
        { name: 'author', label: 'Nombre', type: 'text', required: true },
        { name: 'role', label: 'Cargo u organización', type: 'text' },
      ],
    },
    { name: 'image', label: 'Retrato', type: 'upload', relationTo: 'media' },
    {
      name: 'tone',
      label: 'Color de fondo',
      type: 'select',
      defaultValue: 'corinto',
      options: [
        { label: 'Corinto', value: 'corinto' },
        { label: 'Fucsia', value: 'fucsia' },
        { label: 'Ocre', value: 'ocre' },
      ],
    },
  ],
}
