import type { Block } from 'payload'

export const Statement: Block = {
  slug: 'statement',
  interfaceName: 'StatementBlock',
  labels: { singular: 'Qué somos (declaración)', plural: 'Qué somos (declaración)' },
  fields: [
    { name: 'heading', label: 'Título pequeño', type: 'text', required: true, defaultValue: 'Qué es la AMMI' },
    {
      name: 'statement',
      label: 'Declaración',
      type: 'textarea',
      required: true,
      admin: { description: 'Una o dos frases. Se muestra en letra grande.' },
      defaultValue:
        'Somos organizaciones de mujeres, mujeres indígenas y mujeres en lo individual que, articuladas en alianza, promovemos el acceso a la justicia y la participación política de las mujeres.',
    },
    {
      name: 'peoplesLine',
      label: 'Frase de pueblos',
      type: 'textarea',
      admin: { description: 'Una línea bajo la declaración. Déjala vacía para no mostrarla.' },
      defaultValue: 'Somos mayas, garífunas, xincas, afrodescendientes, mestizas y ladinas, en una sola alianza.',
    },
    {
      name: 'image',
      label: 'Foto panorámica',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'De preferencia horizontal y ancha (por ejemplo 2880 × 1100).' },
    },
  ],
}
