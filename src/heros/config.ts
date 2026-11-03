import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Tipo de portada',
      options: [
        {
          label: 'Ninguna',
          value: 'none',
        },
        {
          label: 'Mosaico (inicio)',
          value: 'highImpact',
        },
        {
          label: 'Título e imagen ancha',
          value: 'mediumImpact',
        },
        {
          label: 'Solo título',
          value: 'lowImpact',
        },
      ],
      required: true,
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
      label: 'Título',
      admin: {
        description: 'Usa un Encabezado 1 corto (dos líneas como máximo) y, si quieres, un párrafo.',
      },
    },
    {
      name: 'standfirst',
      label: 'Entradilla',
      type: 'textarea',
      admin: {
        description: 'Una frase que explica qué es esta página. Se muestra junto al título.',
      },
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      label: 'Imagen principal',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'mosaic',
      label: 'Imágenes del mosaico',
      type: 'array',
      maxRows: 3,
      admin: {
        condition: (_, { type } = {}) => type === 'highImpact',
        description: 'Hasta tres imágenes más. Se combinan con bloques de color de la marca.',
      },
      fields: [
        {
          name: 'image',
          label: 'Imagen',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
  label: false,
}
