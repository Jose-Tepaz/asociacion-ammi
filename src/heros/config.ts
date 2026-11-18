import type { Field } from 'payload'

import { HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'
import { firstLineAsTitle } from '@/fields/titleRichText'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
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
      // Sin tipos de texto: el tamaño del título lo pone el diseño.
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            // Sin barra de botones: se ve como un campo de texto normal.
            // La cursiva se sigue pudiendo poner con Cmd + I (sale en ocre en el sitio).
            ...rootFeatures.filter((feature) => !['paragraph', 'link'].includes(feature.key)),
            // Solo Encabezado 1: es como se guarda el título (ver firstLineAsTitle)
            HeadingFeature({ enabledHeadingSizes: ['h1'] }),
          ]
        },
      }),
      hooks: {
        beforeValidate: [firstLineAsTitle],
      },
      label: 'Título',
      admin: {
        className: 'ammi-campo-titulo',
        description: 'El título grande de la portada.',
      },
    },
    {
      name: 'standfirst',
      label: 'Descripción',
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
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Tipo de portada',
      admin: {
        description: 'Cambia el diseño de la portada. Los campos de arriba cambian según el tipo.',
      },
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
  ],
  label: false,
}
