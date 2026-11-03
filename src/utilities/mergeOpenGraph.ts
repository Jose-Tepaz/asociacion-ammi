import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'Alianza de 18 organizaciones de mujeres y mujeres indígenas por la participación política y el acceso a la justicia en Guatemala.',
  images: [
    {
      url: `${getServerSideURL()}/website-template-OG.webp`,
    },
  ],
  siteName: 'AMMI',
  title: 'AMMI · Alianza de Mujeres y Mujeres Indígenas por el Acceso a la Justicia',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
