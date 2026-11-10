import type { Block, Field } from 'payload'

/** Campos de una voz: los usa la voz principal y cada una de «Más voces». */
const voiceFields = (): Field[] => [
  { name: 'quote', label: 'Cita', type: 'textarea', required: true, admin: { description: 'Máximo 25 palabras.' } },
  { name: 'author', label: 'Nombre', type: 'text', required: true },
  {
    name: 'role',
    label: 'Cargo u organización',
    type: 'text',
    admin: { description: 'Cargo, profesión u organización de la persona. Ej.: Fundadora, Magistrada, Co-dirección.' },
  },
  {
    name: 'source',
    label: 'Fuente',
    type: 'text',
    admin: {
      description: 'Dónde o en qué ocasión se dijo la cita. Ej. Foro, conferencia, entrevista o informe.',
    },
  },
  {
    name: 'image',
    label: 'Retrato',
    type: 'upload',
    relationTo: 'media',
    admin: {
      description:
        'Para cambiar la foto, quítala con la ✕ y sube o elige otra aquí. No la cambies desde «Medios»: se cambiaría en todas las páginas que usan esa misma foto.',
    },
  },
]

export const Quote: Block = {
  slug: 'quote',
  interfaceName: 'QuoteBlock',
  labels: { singular: 'Voz (cita)', plural: 'Voces (citas)' },
  fields: [
    ...voiceFields(),
    {
      name: 'moreVoices',
      label: 'Más voces',
      type: 'array',
      labels: { singular: 'Cita', plural: 'Citas' },
      admin: {
        description:
          'Opcional. Con una o más, la tarjeta muestra el contador (01 / 02) y flechas para pasar de una voz a otra.',
        initCollapsed: true,
      },
      fields: voiceFields(),
    },
    {
      // Oculto: la tarjeta va siempre en corinto. Se conserva la columna para no tener que borrarla con migración
      name: 'tone',
      label: 'Color de fondo',
      type: 'select',
      defaultValue: 'corinto',
      admin: { hidden: true },
      options: [
        { label: 'Corinto', value: 'corinto' },
        { label: 'Fucsia', value: 'fucsia' },
        { label: 'Ocre', value: 'ocre' },
      ],
    },
  ],
}
