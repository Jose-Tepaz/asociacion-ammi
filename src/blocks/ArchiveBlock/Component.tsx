import type { Post, ArchiveBlock as ArchiveBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'

import { CollectionArchive } from '@/components/CollectionArchive'
import { CMSLink } from '@/components/Link'
import { ArrowRight } from 'lucide-react'

import { FeaturedPosts } from './Featured'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
  }
> = async (props) => {
  const {
    id,
    allLink,
    categories,
    description,
    display,
    heading,
    introContent,
    limit: limitFromProps,
    populateBy,
    selectedDocs,
  } = props

  const limit = limitFromProps || 3

  let posts: Post[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    const flattenedCategories = categories?.map((category) => {
      if (typeof category === 'object') return category.id
      else return category
    })

    const fetchedPosts = await payload.find({
      collection: 'posts',
      depth: 1,
      limit,
      sort: '-publishedAt',
      // Respeta los permisos públicos: los borradores no aparecen en el sitio
      overrideAccess: false,
      ...(flattenedCategories && flattenedCategories.length > 0
        ? {
            where: {
              categories: {
                in: flattenedCategories,
              },
            },
          }
        : {}),
    })

    posts = fetchedPosts.docs
  } else {
    if (selectedDocs?.length) {
      const filteredSelectedPosts = selectedDocs.map((post) => {
        if (typeof post.value === 'object') return post.value
      }) as Post[]

      posts = filteredSelectedPosts
    }
  }

  return (
    <section id={`block-${id}`}>
      {(heading || description || introContent || (allLink?.enabled && allLink.link?.label)) && (
        <div
          className="container mb-10 md:mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
          data-reveal
        >
          {heading || description ? (
            <div>
              {heading && <h2 className="m-0 text-step-head">{heading}</h2>}
              {description && (
                <p className="mt-4 md:mt-3 lg:mt-4 text-step-body text-muted-foreground md:max-w-[52ch]">
                  {description}
                </p>
              )}
            </div>
          ) : (
            introContent && (
              <RichText
                className="[&_h2]:text-step-head [&_h2]:m-0 [&_h3]:text-step-title [&_h3]:m-0 [&_p]:mt-4 md:[&_p]:mt-3 lg:[&_p]:mt-4 [&_p]:text-step-body [&_p]:text-muted-foreground md:[&_p]:max-w-[52ch]"
                data={introContent}
                enableGutter={false}
                enableProse={false}
              />
            )
          )}
          {allLink?.enabled && allLink.link?.label && (
            <CMSLink
              appearance="outline"
              className="self-start md:self-auto shrink-0"
              {...allLink.link}
            >
              <ArrowRight aria-hidden="true" />
            </CMSLink>
          )}
        </div>
      )}
      {display === 'grid' ? <CollectionArchive posts={posts} /> : <FeaturedPosts posts={posts} />}
    </section>
  )
}
