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
          label: 'Pantalla completa con foto o video (inicio)',
          value: 'highImpact',
        },
        {
          label: 'Título con foto al lado',
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
      name: 'dark',
      label: 'Foto a pantalla completa',
      type: 'checkbox',
      admin: {
        condition: (_, { type } = {}) => type === 'mediumImpact',
        description: 'La foto ocupa todo el fondo y el texto va encima. Sin marcar: fondo corinto con la foto a un lado.',
      },
    },
    {
      name: 'kicker',
      label: 'Etiqueta sobre el título',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type !== 'none',
        placeholder: 'Guatemala · desde 2013',
      },
    },
    {
      // Se llama «tone» por una versión anterior; cambiarlo obligaría a migrar la base
      name: 'tone',
      label: 'Diseño',
      type: 'select',
      defaultValue: 'corinto',
      options: [
        { label: 'Banda corinto', value: 'corinto' },
        { label: 'Calendario (fecha de hoy)', value: 'calendario' },
        { label: 'Contacto (datos y redes)', value: 'contacto' },
      ],
      admin: {
        condition: (_, { type } = {}) => type === 'lowImpact',
        description: 'Cada página interna puede tener su propio diseño de portada.',
      },
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
        description: 'Usa un Encabezado 1 y, si quieres, un párrafo.',
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
        description:
          'En la portada del inicio puedes subir un video MP4: horizontal, de 10 a 20 segundos y de menos de 8 MB. Se reproduce sin sonido y en bucle.',
      },
      label: 'Imagen o video principal',
      relationTo: 'media',

      required: true,
    },
    {
      name: 'featured',
      label: 'Publicación destacada',
      type: 'group',
      admin: {
        condition: (_, { type } = {}) => type === 'highImpact',
        description: 'Se muestra bajo los botones. Si no eliges una, aparece la más reciente.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              label: 'Etiqueta',
              type: 'text',
              defaultValue: 'Nuevo pronunciamiento',
            },
            {
              name: 'post',
              label: 'Publicación',
              type: 'relationship',
              relationTo: 'posts',
            },
          ],
        },
      ],
    },
    {
      name: 'mosaic',
      label: 'Imagen secundaria',
      type: 'array',
      maxRows: 1,
      admin: {
        // Ya no se muestra en la portada; se conserva oculto para no migrar la base
        hidden: true,
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
