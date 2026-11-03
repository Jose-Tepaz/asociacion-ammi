import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

export const getCategoryBySlug = cache(async (slug: string) => {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'categories',
    limit: 1,
    where: { slug: { equals: decodeURIComponent(slug) } },
  })
  return docs[0] || null
})
