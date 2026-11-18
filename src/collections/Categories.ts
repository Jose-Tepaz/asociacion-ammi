import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'
import { createBreadcrumbsField, createParentField } from '@payloadcms/plugin-nested-docs'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Categoría', plural: 'Categorías' },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug'],
    description:
      'Cada categoría con publicaciones aparece como una pestaña en Publicaciones (por ejemplo: Noticias, Galería, Incidencia).',
  },
  fields: [
    {
      name: 'title',
      label: 'Nombre',
      type: 'text',
      required: true,
    },
    slugField({
      position: undefined,
    }),
    // Subcategorías (plugin nested-docs): el sitio no las usa, así que se ocultan en el admin.
    // Los campos se quedan en la base de datos; para volver a mostrarlos, quita `hidden`.
    createParentField('categories', { admin: { hidden: true, disableListColumn: true, disableListFilter: true } }),
    createBreadcrumbsField('categories', { admin: { hidden: true, disableListColumn: true, disableListFilter: true } }),
  ],
}
