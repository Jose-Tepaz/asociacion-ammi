'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import { FileText, Images, SquareArrowOutUpRight } from 'lucide-react'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title'> &
  Partial<Pick<Post, 'gallery' | 'documents'>>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showCategories, title: titleFromProps } = props

  const { slug, categories, meta, title, gallery, documents } = doc || {}
  const photos = gallery?.length || 0
  const files = documents || []
  const fileLabel =
    files.length === 0
      ? null
      : files.every((d) => typeof d.file === 'object' && d.file?.mimeType?.includes('pdf'))
        ? files.length === 1
          ? 'PDF'
          : `${files.length} PDF`
        : files.length === 1
          ? 'Documento'
          : `${files.length} documentos`
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`

  return (
    <article
      className={cn(
        'group flex flex-col overflow-hidden rounded-card bg-white ring-1 ring-texto-primario/5 hover:cursor-pointer',
        className,
      )}
      ref={card.ref}
    >
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-besh-fuerte">
        {(photos > 0 || fileLabel) && (
          <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-2">
            {photos > 0 && (
              <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-corinto-secundario/90 px-2.5 text-step-small font-medium text-besh-suave">
                <Images aria-hidden="true" className="size-3.5" />
                Galería · {photos} {photos === 1 ? 'foto' : 'fotos'}
              </span>
            )}
            {fileLabel && (
              <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-corinto-secundario/90 px-2.5 text-step-small font-medium text-besh-suave">
                <FileText aria-hidden="true" className="size-3.5" />
                {fileLabel}
              </span>
            )}
          </div>
        )}
        {metaImage && typeof metaImage !== 'string' ? (
          <Media
            fill
            imgClassName="object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
            resource={metaImage}
            size="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-end bg-corinto p-5">
            <span className="text-step-body text-besh-suave">{titleToUse}</span>
          </div>
        )}
      </div>
      <div className="flex-1 p-5">
        {showCategories && hasCategories && (
          <p className="mb-3 inline-block rounded-md bg-besh-fuerte px-2 py-0.5 text-step-small font-medium text-corinto">
            {categories?.map((category, index) => {
              if (typeof category === 'object') {
                const { title: titleFromCategory } = category

                const categoryTitle = titleFromCategory || 'Sin categoría'

                const isLast = index === categories.length - 1

                return (
                  <Fragment key={index}>
                    {categoryTitle}
                    {!isLast && <Fragment>, &nbsp;</Fragment>}
                  </Fragment>
                )
              }

              return null
            })}
          </p>
        )}
        {titleToUse && (
          <h3 className="flex items-start justify-between gap-3 font-[family-name:var(--font-display)] text-step-body font-semibold leading-snug">
            <Link className="transition-colors group-hover:text-corinto" href={href} ref={link.ref}>
              {titleToUse}
            </Link>
            <span
              aria-hidden="true"
              className="grid size-9 shrink-0 place-items-center rounded-full bg-corinto/10 text-corinto transition-colors duration-300 group-hover:bg-corinto group-hover:text-besh-suave"
            >
              <SquareArrowOutUpRight className="size-4" />
            </span>
          </h3>
        )}
        {description && <p className="mt-2 text-step-small text-texto-secundario line-clamp-2">{sanitizedDescription}</p>}
      </div>
    </article>
  )
}
