import type { Block } from 'payload'

import { optionalLink } from '@/fields/optionalLink'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Archive: Block = {
  slug: 'archive',
  interfaceName: 'ArchiveBlock',
  labels: { singular: 'Publicaciones', plural: 'Publicaciones' },
  fields: [
    {
      name: 'heading',
      label: 'Título',
      type: 'text',
    },
    {
      name: 'description',
      label: 'Descripción',
      type: 'textarea',
      admin: { description: 'Una frase corta debajo del título. Es opcional.' },
    },
    {
      // Texto de antes, cuando título y descripción iban juntos. Se oculta en cuanto se llena el título o la descripción.
      name: 'introContent',
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
      label: 'Introducción (versión anterior)',
      admin: {
        condition: (_, siblingData) => !siblingData?.heading && !siblingData?.description,
        description: 'Ya no hace falta: usa Título y Descripción. Cuando los llenes, esto deja de mostrarse.',
      },
    },
    {
      name: 'display',
      label: 'Presentación',
      type: 'select',
      defaultValue: 'featured',
      options: [
        { label: 'Una destacada y lista al lado', value: 'featured' },
        { label: 'Cuadrícula de tarjetas', value: 'grid' },
      ],
    },
    optionalLink('allLink', 'Botón «ver todas»'),
    {
      name: 'populateBy',
      label: 'Cómo elegir las publicaciones',
      type: 'select',
      defaultValue: 'collection',
      options: [
        {
          label: 'Las más recientes',
          value: 'collection',
        },
        {
          label: 'Elegirlas una por una',
          value: 'selection',
        },
      ],
    },
    {
      name: 'relationTo',
      type: 'select',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
      },
      defaultValue: 'posts',
      label: 'Qué mostrar',
      options: [
        {
          label: 'Publicaciones',
          value: 'posts',
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
      },
      hasMany: true,
      label: 'Solo de estas categorías',
      relationTo: 'categories',
    },
    {
      name: 'limit',
      type: 'number',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
        step: 1,
      },
      defaultValue: 10,
      label: 'Cuántas mostrar',
    },
    {
      name: 'selectedDocs',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'selection',
      },
      hasMany: true,
      label: 'Publicaciones elegidas',
      relationTo: ['posts'],
    },
  ],
}
