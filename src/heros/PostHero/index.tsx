import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import type { Category, Post } from '@/payload-types'

import { cholqij } from '@/components/MayaDate/cholqij'
import { NawalGlyph } from '@/components/MayaDate/CholqijDay'
import { formatAuthors } from '@/utilities/formatAuthors'
import { formatDateLong } from '@/utilities/formatDateTime'

/** La fecha de publicación en el calendario de Guatemala, para calcular su día en el Cholq'ij. */
const localDay = (iso: string) => {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Guatemala' }).format(new Date(iso))
  const [y, m, d] = parts.split('-').map(Number)
  return new Date(y!, m! - 1, d!)
}

export const PostHero: React.FC<{ post: Post }> = ({ post }) => {
  const { categories, populatedAuthors, publishedAt, title } = post
  const cats = (categories || []).filter((c): c is Category => typeof c === 'object' && c !== null)
  const authors = populatedAuthors?.length ? formatAuthors(populatedAuthors) : ''
  const day = publishedAt ? cholqij(localDay(publishedAt)) : null

  return (
    <header className="bg-corinto-secundario text-besh-suave" data-hero="dark" data-theme="dark">
      <div className="container py-[var(--section-y)]">
        <nav aria-label="Ruta" className="fade-up">
          <ol className="flex flex-wrap items-center gap-1.5 text-step-small text-besh-oscuro">
            <li>
              <Link className="underline-offset-4 hover:text-besh-suave hover:underline" href="/posts">
                Publicaciones
              </Link>
            </li>
            {cats[0] && (
              <>
                <ChevronRight aria-hidden="true" className="size-3.5" />
                <li>
                  <Link
                    className="underline-offset-4 hover:text-besh-suave hover:underline"
                    href={`/posts/categoria/${cats[0].slug}`}
                  >
                    {cats[0].title}
                  </Link>
                </li>
              </>
            )}
          </ol>
        </nav>

        <div className="mask-line mt-8">
          <h1 className="text-[clamp(2.25rem,1.3rem+2.8vw,3.75rem)] leading-[1.05] max-w-[30ch]">{title}</h1>
        </div>

        <dl className="fade-up mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-step-small">
          {cats.length > 0 && (
            <div className="flex gap-2">
              <dt className="sr-only">Categoría</dt>
              {cats.map((c) => (
                <dd key={c.id}>
                  <Link
                    className="inline-flex h-8 items-center rounded-full bg-besh-suave/10 px-3.5 font-medium text-ocre transition-colors hover:bg-besh-suave/20"
                    href={`/posts/categoria/${c.slug}`}
                  >
                    {c.title}
                  </Link>
                </dd>
              ))}
            </div>
          )}
          {publishedAt && (
            <div>
              <dt className="sr-only">Publicado</dt>
              <dd>
                <time dateTime={publishedAt}>{formatDateLong(publishedAt)}</time>
              </dd>
            </div>
          )}
          {day && (
            <div className="flex items-center gap-2" title={day.significado}>
              <dt className="sr-only">Día del Cholq&apos;ij</dt>
              <span className="grid size-8 place-items-center rounded-full bg-besh-suave/10 text-ocre">
                <NawalGlyph className="size-5" src={day.glifo} />
              </span>
              <dd lang="cak">
                {day.numero} {day.nawal}
              </dd>
            </div>
          )}
          {authors && (
            <div>
              <dt className="sr-only">Autoría</dt>
              <dd>Por {authors}</dd>
            </div>
          )}
        </dl>
      </div>
      <span aria-hidden="true" className="tejido" />
    </header>
  )
}
