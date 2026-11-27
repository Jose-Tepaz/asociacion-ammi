import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { toDirectFileUrl } from './directMediaFile'
import { defaultDescription, mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/ammi-og.jpg'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url || image.url

    // Por /archivos, para que WhatsApp o Facebook al leer la vista previa no enciendan la base
    if (ogUrl) url = serverUrl + toDirectFileUrl(ogUrl)
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
}): Promise<Metadata> => {
  const { doc } = args

  const ogImage = getImageURL(doc?.meta?.image)

  const siteTitle = 'AMMI · Alianza de Mujeres y Mujeres Indígenas por el Acceso a la Justicia'
  // El inicio lleva el nombre completo; las demás páginas y publicaciones, su propio título.
  // Si en el SEO del admin no se escribió título, se usa el de la página o publicación.
  const isHome = doc?.slug === 'home'
  const pageTitle = doc?.meta?.title || (isHome ? '' : doc?.title)
  const title = pageTitle ? pageTitle + ' · AMMI' : siteTitle

  return {
    description: doc?.meta?.description || defaultDescription,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || defaultDescription,
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    title,
  }
}
