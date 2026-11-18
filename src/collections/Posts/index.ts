import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
  OrderedListFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { populateAuthors } from './hooks/populateAuthors'
import { revalidateDelete, revalidatePost } from './hooks/revalidatePost'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from 'payload'

export const Posts: CollectionConfig<'posts'> = {
  slug: 'posts',
  labels: { singular: 'Publicación', plural: 'Publicaciones' },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a post is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'posts'>
  defaultPopulate: {
    title: true,
    slug: true,
    categories: true,
    meta: {
      image: true,
      description: true,
    },
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'posts',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'posts',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      label: 'Título principal',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'subtitle',
              label: 'Título secundario',
              type: 'text',
            },
            {
              name: 'heroImage',
              label: 'Imagen de portada',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'content',
              type: 'richText',
              // Editor simple: negrita, cursiva, subrayado, enlaces y listas (viñetas y numeradas). El tamaño y el estilo
              // del texto los pone el diseño del sitio, así que no se pueden cambiar aquí.
              // HeadingFeature sin tamaños solo sirve para que abran bien las publicaciones viejas
              // que ya tienen títulos; ya no deja crear ni cambiar títulos.
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: [] }),
                    UnorderedListFeature(),
                    OrderedListFeature(),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                  ]
                },
              }),
              label: 'Texto de la publicación',
              required: true,
            },
          ],
          label: 'Contenido',
        },
        {
          label: 'Galería y documentos',
          description: 'La página se adapta sola: si hay fotos aparece la galería, y si hay archivos aparecen para descargar.',
          fields: [
            {
              name: 'gallery',
              label: 'Galería de fotos',
              type: 'array',
              labels: { singular: 'Foto', plural: 'Fotos' },
              admin: { initCollapsed: true },
              fields: [
                { name: 'image', label: 'Foto', type: 'upload', relationTo: 'media', required: true },
                { name: 'caption', label: 'Descripción (opcional)', type: 'text' },
              ],
            },
            {
              name: 'documents',
              label: 'Documentos para descargar',
              type: 'array',
              labels: { singular: 'Documento', plural: 'Documentos' },
              admin: { description: 'PDF, Word, Excel u otros archivos.' },
              fields: [
                { name: 'file', label: 'Archivo', type: 'upload', relationTo: 'media', required: true },
                {
                  name: 'title',
                  label: 'Nombre del documento',
                  type: 'text',
                  admin: { description: 'Es el nombre que se ve en la página. Si lo dejas vacío se usa el nombre del archivo.' },
                },
              ],
            },
          ],
        },
        {
          fields: [
            {
              name: 'relatedPosts',
              label: 'Publicaciones relacionadas',
              type: 'relationship',
              // Oculto: el sitio elige solo las relacionadas (más recientes de la misma categoría).
              // El campo se queda en la base de datos.
              admin: {
                position: 'sidebar',
                hidden: true,
                disableListColumn: true,
                disableListFilter: true,
              },
              filterOptions: ({ id }) => {
                return {
                  id: {
                    not_in: [id],
                  },
                }
              },
              hasMany: true,
              relationTo: 'posts',
            },
            {
              name: 'categories',
              label: 'Categorías',
              type: 'relationship',
              admin: {
                position: 'sidebar',
              },
              hasMany: true,
              relationTo: 'categories',
            },
          ],
          label: 'Clasificación',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      label: 'Fecha de publicación',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'authors',
      label: 'Autoras',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      relationTo: 'users',
    },
    // This field is only used to populate the user data via the `populateAuthors` hook
    // This is because the `user` collection has access control locked to protect user privacy
    // GraphQL will also not return mutated user data that differs from the underlying schema
    {
      name: 'populatedAuthors',
      type: 'array',
      access: {
        update: () => false,
      },
      admin: {
        disabled: true,
        readOnly: true,
      },
      fields: [
        {
          name: 'id',
          type: 'text',
        },
        {
          name: 'name',
          type: 'text',
        },
      ],
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidatePost],
    afterRead: [populateAuthors],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
