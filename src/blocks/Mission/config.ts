import type { Block } from 'payload'

export const Mission: Block = {
  slug: 'mission',
  interfaceName: 'MissionBlock',
  labels: { singular: 'Misión y visión', plural: 'Misión y visión' },
  fields: [
    {
      name: 'layout',
      label: 'Diseño',
      type: 'select',
      required: true,
      defaultValue: 'tabs',
      options: [
        { label: 'Pestañas (título grande)', value: 'tabs' },
        { label: 'Filas con ilustración', value: 'rows' },
      ],
    },
    {
      name: 'items',
      label: 'Pestañas',
      type: 'array',
      minRows: 2,
      maxRows: 4,
      admin: { description: 'Pestañas: cada una cambia el título grande y el texto. Filas: una fila con ilustración por elemento.' },
      defaultValue: [
        {
          label: 'Misión',
          heading: 'Nuestra misión',
          subtitle: 'Justicia y participación con identidad',
          text: 'Promover el acceso a la justicia, la participación política y ciudadana de las mujeres y mujeres indígenas, como actoras y tomadoras de decisiones, en el ejercicio pleno de los derechos humanos individuales, colectivos y específicos de las mujeres y mujeres indígenas, a través de acciones de incidencia y articulación colectiva, desde un enfoque multicultural.',
        },
        {
          label: 'Visión',
          heading: 'Nuestra visión',
          subtitle: 'Un Estado incluyente y con justicia social',
          text: 'Ser una alianza consolidada y reconocida a nivel nacional e internacional que promueve cambios en el sistema político y de justicia que permitan a las mujeres y mujeres indígenas el ejercicio pleno de sus derechos individuales y colectivos desde un enfoque multicultural, que contribuye a la transformación hacia un Estado incluyente, equitativo, representativo y con justicia social.',
        },
        {
          label: 'Valor',
          heading: 'Lo que nos une',
          subtitle: 'Articular para avanzar juntas',
          text: 'La capacidad de articular acciones en conjunto para un trabajo colectivo entre mujeres y mujeres indígenas.',
        },
      ],
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', label: 'Texto de la pestaña', type: 'text', required: true },
            { name: 'heading', label: 'Título grande', type: 'text', required: true },
          ],
        },
        {
          name: 'subtitle',
          label: 'Subtítulo (solo en filas)',
          type: 'text',
          admin: { description: 'Una frase corta bajo el título.' },
        },
        { name: 'text', label: 'Texto', type: 'textarea', required: true },
      ],
    },
  ],
}
