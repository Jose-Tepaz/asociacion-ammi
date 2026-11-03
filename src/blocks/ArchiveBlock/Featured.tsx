import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import type { Category, Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { formatDateLong } from '@/utilities/formatDateTime'

const categoryOf = (post: Post) => {
  const first = post.categories?.[0]
  return first && typeof first === 'object' ? (first as Category).title : null
}

const imageOf = (post: Post) =>
  post.meta?.image && typeof post.meta.image === 'object' ? post.meta.image : null

/** Una publicación destacada grande y las siguientes en lista compacta. */
export const FeaturedPosts: React.FC<{ posts: Post[] }> = ({ posts }) => {
  const [first, ...rest] = posts
  if (!first) return null
  const firstImage = imageOf(first)

  return (
    <div className="container grid gap-5 lg:grid-cols-12">
      <article
        className="group relative grid gap-6 rounded-card bg-besh-fuerte p-5 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:p-7 lg:col-span-7 xl:col-span-8"
        data-reveal
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-besh-oscuro">
          {firstImage && (
            <Media
              fill
              imgClassName="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
              resource={firstImage}
              size="(max-width: 768px) 100vw, 30vw"
            />
          )}
        </div>
        <div className="flex flex-col">
          <p className="flex flex-wrap justify-between gap-2 text-step-small">
            {categoryOf(first) && <span className="font-medium text-fucsia">{categoryOf(first)}</span>}
            {first.publishedAt && (
              <time className="text-muted-foreground" dateTime={first.publishedAt}>
                {formatDateLong(first.publishedAt)}
              </time>
            )}
          </p>
          <h3 className="mt-4 text-step-title">
            <Link className="after:absolute after:inset-0" href={`/posts/${first.slug}`}>
              {first.title}
            </Link>
          </h3>
          {first.meta?.description && (
            <p className="mt-4 text-step-body text-muted-foreground line-clamp-5">{first.meta.description}</p>
          )}
          <span className="mt-auto pt-8 inline-flex">
            <span className="inline-flex h-11 items-center gap-2 rounded-full bg-corinto px-5 text-step-small font-medium text-besh-suave transition-colors group-hover:bg-corinto-terciario">
              Leer completo
              <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </span>
        </div>
      </article>

      {rest.length > 0 && (
        <ul className="flex flex-col gap-5 lg:col-span-5 xl:col-span-4" role="list">
          {rest.map((post, i) => {
            const image = imageOf(post)
            return (
              <li data-reveal key={post.id} style={{ '--i': i + 1 } as React.CSSProperties}>
                <article className="group relative flex h-full gap-4 rounded-card bg-besh-fuerte p-4 transition-colors hover:bg-besh-oscuro/70">
                  <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-lg bg-besh-oscuro">
                    {image && <Media fill imgClassName="object-cover object-top" resource={image} size="96px" />}
                  </div>
                  <div className="min-w-0 flex flex-col">
                    {categoryOf(post) && (
                      <span className="text-step-small font-medium text-fucsia">{categoryOf(post)}</span>
                    )}
                    <h3 className="mt-1 text-step-body font-[family-name:var(--font-display)] font-semibold leading-snug line-clamp-3">
                      <Link className="after:absolute after:inset-0" href={`/posts/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>
                    {post.publishedAt && (
                      <time className="mt-auto pt-2 text-step-small text-muted-foreground" dateTime={post.publishedAt}>
                        {formatDateLong(post.publishedAt)}
                      </time>
                    )}
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
