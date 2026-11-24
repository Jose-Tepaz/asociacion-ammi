import type { Media, Post } from '@/payload-types'

type PostWithImages = Partial<Pick<Post, 'meta' | 'heroImage' | 'gallery'>>

const asMedia = (value: unknown): Media | null =>
  value && typeof value === 'object' && 'url' in value ? (value as Media) : null

/**
 * Imagen de una publicación para tarjetas y listados: siempre la Imagen de portada.
 * Solo si no tiene, usa la imagen de SEO y, si tampoco, la primera foto de la galería.
 */
export const postImage = (post?: PostWithImages | null): Media | null =>
  asMedia(post?.heroImage) ||
  asMedia(post?.meta?.image) ||
  asMedia(post?.gallery?.find((item) => asMedia(item?.image))?.image) ||
  null
