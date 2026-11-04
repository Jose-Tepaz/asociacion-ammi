import configPromise from '@payload-config'
import Link from 'next/link'
import { getPayload, type Where } from 'payload'
import React from 'react'

import type { Category } from '@/payload-types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { Pagination } from '@/components/Pagination'
import { cn } from '@/utilities/ui'

export const POSTS_PER_PAGE = 12

/** Las categorías que tienen al menos una publicación, en orden alfabético. */
export const getPostCategories = async () => {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'categories',
    limit: 100,
    pagination: false,
    sort: 'title',
  })
  const counts = await Promise.all(
    docs.map((category) =>
      payload
        .count({ collection: 'posts', overrideAccess: false, where: { categories: { in: [category.id] } } })
        .then(({ totalDocs }) => ({ category, totalDocs })),
    ),
  )
  return counts.filter(({ totalDocs }) => totalDocs > 0)
}

/**
 * Listado de publicaciones con pestañas por categoría.
 * Las pestañas salen de la colección Categorías: al crear una nueva en el admin,
 * aparece aquí en cuanto tenga publicaciones.
 */
export const PostsListing = async ({ category, page = 1 }: { category?: Category; page?: number }) => {
  const payload = await getPayload({ config: configPromise })
  const where: Where | undefined = category ? { categories: { in: [category.id] } } : undefined

  const [posts, categories, total] = await Promise.all([
    payload.find({
      collection: 'posts',
      depth: 1,
      limit: POSTS_PER_PAGE,
      page,
      sort: '-publishedAt',
      overrideAccess: false,
      where,
      select: { title: true, slug: true, categories: true, meta: true, publishedAt: true, gallery: true, documents: true },
    }),
    getPostCategories(),
    payload.count({ collection: 'posts', overrideAccess: false }),
  ])

  const tabs = [
    { href: '/posts', label: 'Todas', count: total.totalDocs, active: !category },
    ...categories.map(({ category: c, totalDocs }) => ({
      href: `/posts/categoria/${c.slug}`,
      label: c.title,
      count: totalDocs,
      active: category?.id === c.id,
    })),
  ]
  const basePath = category ? `/posts/categoria/${category.slug}` : '/posts'

  return (
    <div className="pb-[var(--section-y)]">
      <section className="bg-corinto-secundario text-besh-suave" data-hero="dark" data-theme="dark">
        <div className="container py-[calc(var(--section-y)*2.25)] text-center">
          <h1 className="text-step-display">
            {category ? category.title : 'Publicaciones'}
          </h1>
          <p className="mx-auto mt-5 text-step-lead text-besh-fuerte max-w-[64ch]">
            {category
              ? `Todo lo que la Alianza ha publicado en ${category.title.toLowerCase()}.`
              : 'Pronunciamientos, actividades, noticias y voces de la Alianza.'}
          </p>
        </div>
        <span aria-hidden="true" className="tejido" />
      </section>

      <div className="container pt-[var(--section-y)]">
        <nav
          aria-label="Categorías de publicaciones"
          className="mx-auto w-fit max-w-full overflow-x-auto rounded-full bg-white p-1.5 shadow-[0_16px_32px_-16px_rgb(36_15_22/0.4)] ring-1 ring-texto-primario/5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <ul className="flex w-max gap-1">
            {tabs.map((tab) => (
              <li key={tab.href}>
                <Link
                  aria-current={tab.active ? 'page' : undefined}
                  className={cn(
                    'inline-flex h-11 items-center gap-1.5 rounded-full px-5 text-step-small font-medium transition-colors',
                    tab.active ? 'bg-corinto text-besh-suave' : 'text-texto-primario hover:text-corinto',
                  )}
                  href={tab.href}
                >
                  {tab.label}
                  <span className={cn('text-step-small', tab.active ? 'text-besh-fuerte' : 'text-texto-secundario')}>
                    {tab.count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mt-10 md:mt-12">
        {posts.docs.length > 0 ? (
          <CollectionArchive posts={posts.docs} />
        ) : (
          <p className="container text-step-body text-muted-foreground">Todavía no hay publicaciones aquí.</p>
        )}
      </div>

      {posts.totalPages > 1 && posts.page && (
        <div className="container">
          <Pagination basePath={basePath} page={posts.page} totalPages={posts.totalPages} />
        </div>
      )}
    </div>
  )
}
