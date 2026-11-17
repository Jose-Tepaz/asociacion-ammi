import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Banner: Block = {
  slug: 'banner',
  labels: { singular: 'Aviso destacado', plural: 'Avisos destacados' },
  fields: [
    {
      name: 'style',
      label: 'Tipo de aviso',
      type: 'select',
      defaultValue: 'info',
      options: [
        { label: 'Información', value: 'info' },
        { label: 'Advertencia', value: 'warning' },
        { label: 'Importante', value: 'error' },
        { label: 'Logro', value: 'success' },
      ],
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
      label: false,
      required: true,
    },
  ],
  interfaceName: 'BannerBlock',
}
