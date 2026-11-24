import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Post } from '../../../payload-types'

// Las listas de publicaciones (todas, con paginación y por categoría) se guardan en caché hasta 10 minutos.
// Se refrescan al publicar, despublicar o borrar para que la publicación aparezca o desaparezca enseguida.
const revalidateLists = () => {
  revalidatePath('/posts')
  revalidatePath('/posts/page/[pageNumber]', 'page')
  revalidatePath('/posts/categoria/[slug]', 'page')
  revalidatePath('/posts/categoria/[slug]/page/[pageNumber]', 'page')
}

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/posts/${doc.slug}`

      payload.logger.info(`Revalidating post at path: ${path}`)

      revalidatePath(path)
      revalidateLists()
      revalidateTag('posts-sitemap', 'max')
    }

    // If the post was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/posts/${previousDoc.slug}`

      payload.logger.info(`Revalidating old post at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateLists()
      revalidateTag('posts-sitemap', 'max')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = `/posts/${doc?.slug}`

    revalidatePath(path)
    revalidateLists()
    revalidateTag('posts-sitemap', 'max')
  }

  return doc
}
