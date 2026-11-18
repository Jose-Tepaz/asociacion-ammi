import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { searchFields } from '@/search/fieldOverrides'
import { beforeFormEmail } from '@/utilities/formEmail'
import { arrangeFormFields, arrangeSubmissionFields } from './formFields'
import { beforeSyncWithSearch } from '@/search/beforeSync'

import { Page, Post } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} · AMMI` : 'AMMI'
}

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

/**
 * Menú del admin agrupado por temas, en este orden:
 * Contenido del sitio, Mensajes, Partes fijas del sitio (Encabezado y Pie de página) y Ajustes avanzados.
 * «Ajustes avanzados» se dibuja aparte al final (src/components/AdminNavAjustes), porque Payload
 * pone los grupos de los globals después de todas las colecciones.
 */
const MENU: { slug: string; group: string | false }[] = [
  { slug: 'pages', group: 'Contenido del sitio' },
  { slug: 'posts', group: 'Contenido del sitio' },
  { slug: 'categories', group: 'Contenido del sitio' },
  { slug: 'media', group: 'Contenido del sitio' },
  { slug: 'form-submissions', group: 'Mensajes' },
  { slug: 'forms', group: 'Mensajes' },
  { slug: 'users', group: false },
  { slug: 'redirects', group: false },
  { slug: 'search', group: false },
]
const GRUPO_GLOBALES = 'Partes fijas del sitio'

const ordenarMenu: Plugin = (config) => {
  const pos = (slug: string) => {
    const i = MENU.findIndex((m) => m.slug === slug)
    return i === -1 ? MENU.length : i
  }
  return {
    ...config,
    admin: {
      ...config.admin,
      components: {
        ...config.admin?.components,
        afterNavLinks: [
          ...(config.admin?.components?.afterNavLinks || []),
          '@/components/AdminNavAjustes#NavAjustes',
        ],
      },
    },
    collections: [...(config.collections || [])]
      .sort((a, b) => pos(a.slug) - pos(b.slug))
      .map((collection) => {
        const item = MENU.find((m) => m.slug === collection.slug)
        return item ? { ...collection, admin: { ...collection.admin, group: item.group } } : collection
      }),
    globals: (config.globals || []).map((global) => ({
      ...global,
      admin: { ...global.admin, group: GRUPO_GLOBALES },
    })),
  }
}

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'posts'],
    overrides: {
      labels: { singular: 'Redirección', plural: 'Redirecciones' },
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'Dirección vieja que debe llevar a otra página.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    // Remitente del sistema y diseño de AMMI en los correos (src/utilities/formEmail.ts)
    beforeEmail: beforeFormEmail,
    formOverrides: {
      labels: { singular: 'Formulario', plural: 'Formularios' },
      fields: ({ defaultFields }) => {
        const withEditor = defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
        return arrangeFormFields(withEditor)
      },
    },
    formSubmissionOverrides: {
      labels: { singular: 'Respuesta de formulario', plural: 'Respuestas de formularios' },
      admin: {
        defaultColumns: ['createdAt', 'nombre', 'correo', 'mensaje', 'form'],
        components: { beforeListTable: ['@/components/AdminFormRecipients#FormRecipients'] },
      },
      fields: ({ defaultFields }) => arrangeSubmissionFields(defaultFields),
    },
  }),
  searchPlugin({
    collections: ['posts'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      labels: { singular: 'Resultado de búsqueda', plural: 'Resultados de búsqueda' },
      admin: { description: 'Esta lista se llena sola para el buscador del sitio. No hace falta editarla.' },
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
  // Va al final: ordena el menú del admin cuando ya están todas las colecciones de los plugins
  ordenarMenu,
]
