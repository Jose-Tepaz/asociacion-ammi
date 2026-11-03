import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '../../fields/linkGroup'

export const CallToAction: Block = {
  slug: 'cta',
  interfaceName: 'CallToActionBlock',
  fields: [
    {
      name: 'backgroundImage',
      label: 'Foto de fondo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Opcional. Se muestra a la derecha del texto. Para cambiar solo esta sección, elige o sube otra imagen aquí. No reemplaces el archivo desde «Medios»: cambiaría en todas las secciones que usen esa misma imagen.' },
    },
    {
      name: 'note',
      label: 'Dato sobre la foto',
      type: 'text',
      admin: { placeholder: '18 organizaciones ya caminan juntas' },
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    linkGroup({
      appearances: ['default', 'outline'],
      overrides: {
        maxRows: 2,
      },
    }),
  ],
  labels: {
    plural: 'Cierres (llamado a la acción)',
    singular: 'Cierre (llamado a la acción)',
  },
}
