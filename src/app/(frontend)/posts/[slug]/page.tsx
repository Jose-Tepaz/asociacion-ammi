import type { Metadata } from 'next'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { CollectionArchive } from '@/components/CollectionArchive'
import { Lightbox } from '@/components/Lightbox'
import { type DocumentItem, PostDocuments } from '@/components/PostDocuments'
import { type GalleryItem, PostGallery } from '@/components/PostGallery'
import { Media } from '@/components/Media'
import { ShareButtons } from '@/components/ShareButtons'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = posts.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/posts/' + decodedSlug
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) return <PayloadRedirects url={url} />

  const image = post.heroImage && typeof post.heroImage === 'object' ? post.heroImage : null
  const gallery: GalleryItem[] = (post.gallery || []).flatMap((row) =>
    row.image && typeof row.image === 'object'
      ? [{ image: row.image, caption: row.caption, src: getMediaUrl(row.image.url, row.image.updatedAt) }]
      : [],
  )
  const documents: DocumentItem[] = (post.documents || []).flatMap((row) =>
    row.file && typeof row.file === 'object' ? [{ file: row.file, title: row.title }] : [],
  )
  const related = await relatedPostsFor(post)

  return (
    <article>
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <PostHero post={post} />

      <div className="container grid gap-12 py-[var(--section-y)] md:grid-cols-12 md:gap-8 lg:gap-10">
        <aside className="order-2 md:col-span-5 lg:col-span-4 lg:col-start-9">
          <div className="flex flex-col gap-6 md:sticky md:top-6">
            {image && (
              <figure className="rounded-card bg-besh-fuerte p-3">
                <Lightbox alt={image.alt || 'Pieza de la publicación'} src={getMediaUrl(image.url, image.updatedAt)}>
                  <Media
                    imgClassName="h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
                    priority
                    resource={image}
                    size="(max-width: 768px) 100vw, 35vw"
                  />
                </Lightbox>
              </figure>
            )}
            {documents.length > 0 && <PostDocuments items={documents} />}
            <div className="rounded-card bg-besh-fuerte p-5">
              <ShareButtons title={post.title} />
            </div>
          </div>
        </aside>

        <div className="order-1 md:col-span-7">
          {post.meta?.description && (
            <p className="mb-10 font-[family-name:var(--font-display)] text-step-title text-corinto max-w-[34ch]">
              {post.meta.description}
            </p>
          )}
          <RichText className="mx-0 max-w-[68ch]" data={post.content} enableGutter={false} />
          {gallery.length > 0 && <PostGallery items={gallery} />}
          <Link
            className="mt-12 inline-flex items-center gap-2 text-step-small font-medium text-corinto underline-offset-4 hover:underline"
            href="/posts"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Volver a publicaciones
          </Link>
        </div>
      </div>

      {related.length > 0 && (
        <section className="bg-besh-fuerte py-[var(--section-y)]">
          <h2 className="container mb-10 text-step-head">También te puede interesar</h2>
          <CollectionArchive posts={related} slideOnMobile />
        </section>
      )}
    </article>
  )
}

/** Las relacionadas elegidas en el admin o, si no hay, las más recientes de la misma categoría. */
const relatedPostsFor = async (post: Post): Promise<Post[]> => {
  const chosen = (post.relatedPosts || []).filter((p): p is Post => typeof p === 'object' && p !== null)
  if (chosen.length > 0) return chosen.slice(0, 3)

  const categoryIds = (post.categories || []).map((c) => (typeof c === 'object' ? c.id : c))
  const payload = await getPayload({ config: configPromise })
  const find = (exclude: number[], sameCategory: boolean, limit: number) =>
    payload.find({
      collection: 'posts',
      depth: 1,
      limit,
      overrideAccess: false,
      sort: '-publishedAt',
      where: {
        and: [
          { id: { not_in: exclude } },
          ...(sameCategory && categoryIds.length ? [{ categories: { in: categoryIds } }] : []),
        ],
      },
    })

  const same = categoryIds.length ? (await find([post.id], true, 3)).docs : []
  if (same.length >= 3) return same
  // Si la categoría no alcanza, se completa con las más recientes de cualquier otra
  const rest = await find([post.id, ...same.map((p) => p.id)], false, 3 - same.length)
  return [...same, ...rest.docs]
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug({ slug: decodedSlug })

  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
