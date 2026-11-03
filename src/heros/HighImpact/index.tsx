import configPromise from '@payload-config'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import type { Page, Post } from '@/payload-types'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { formatDateLong } from '@/utilities/formatDateTime'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { cn } from '@/utilities/ui'

import { HeroLinks, heroTitleClasses } from '../HeroLinks'
import { HeroVideo } from './HeroVideo'

const latestPost = async (): Promise<Post | null> => {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 1,
    sort: '-publishedAt',
  })
  return docs[0] || null
}

/**
 * Portada del inicio: la foto o el video ocupan todo el fondo, con un velo corinto
 * para leer el texto. El contenido va abajo a la izquierda y el último pronunciamiento a la derecha.
 */
export const HighImpactHero: React.FC<Page['hero']> = async ({
  featured,
  kicker,
  links,
  media,
  richText,
  standfirst,
}) => {
  const post =
    featured?.post && typeof featured.post === 'object' ? featured.post : await latestPost()
  const thumb = post?.meta?.image && typeof post.meta.image === 'object' ? post.meta.image : null
  const resource = media && typeof media === 'object' ? media : null
  const isVideo = Boolean(resource?.mimeType?.startsWith('video/'))

  return (
    <section
      className="relative isolate flex min-h-svh flex-col overflow-hidden bg-corinto-secundario text-besh-suave"
      data-hero="overlay"
      data-theme="dark"
    >
      {/* Fondo: video o foto a todo el ancho */}
      <div aria-hidden={!isVideo} className="absolute inset-0 -z-10">
        {resource &&
          (isVideo ? (
            <HeroVideo src={getMediaUrl(resource.url, resource.updatedAt)} type={resource.mimeType} />
          ) : (
            <Media fill imgClassName="object-cover hero-drift" priority resource={resource} size="100vw" />
          ))}
        {/* Velo corinto: más denso abajo y a la izquierda, donde va el texto */}
        <div className="absolute inset-0 bg-linear-to-t from-corinto-secundario/90 via-corinto-secundario/25 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-corinto-secundario/90 via-corinto-secundario/40 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-corinto-terciario/45 to-transparent" />
      </div>

      <div className="container relative mt-auto grid gap-10 pt-40 pb-[var(--section-y)] lg:grid-cols-12 lg:items-end lg:gap-8">
        <div className="lg:col-span-7">
          {kicker && (
            <p className="fade-up mb-6 inline-flex items-center gap-2 rounded-full bg-besh-suave/15 px-4 py-1.5 text-step-small font-medium text-ocre backdrop-blur-sm">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-ocre" />
              {kicker}
            </p>
          )}
          {richText && (
            <div className="mask-line">
              <div>
                <RichText
                  className={cn(
                    heroTitleClasses,
                    '[&_h1]:text-[clamp(2.5rem,1.2rem+3.6vw,4.75rem)] [&_h1]:leading-[1.02] [&_h1]:max-w-[18ch]',
                  )}
                  data={richText}
                  enableGutter={false}
                  enableProse={false}
                />
              </div>
            </div>
          )}
          {standfirst && (
            <p className="mt-6 text-step-lead text-besh-fuerte max-w-[40ch] fade-up">{standfirst}</p>
          )}
          <HeroLinks className="mt-10 fade-up" links={links} onDark />
        </div>

        {post && (
          <div className="lg:col-span-5 lg:flex lg:justify-end">
            <Link
              className="group fade-up flex w-full max-w-[26rem] items-center gap-4 rounded-2xl bg-besh-suave p-3 pe-5 text-texto-primario shadow-[0_24px_48px_-20px_rgb(0_0_0/0.55)] transition-transform hover:-translate-y-1"
              href={`/posts/${post.slug}`}
            >
              {thumb && (
                <span className="relative block h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-besh-fuerte">
                  <Media fill imgClassName="object-cover object-top" resource={thumb} size="64px" />
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block text-step-small font-medium text-fucsia">
                  {featured?.label || 'Nuevo pronunciamiento'}
                </span>
                <span className="mt-0.5 block font-[family-name:var(--font-display)] text-step-body font-semibold leading-snug line-clamp-2">
                  {post.title}
                </span>
                {post.publishedAt && (
                  <span className="mt-1 block text-step-small text-texto-secundario">
                    {formatDateLong(post.publishedAt)}
                  </span>
                )}
              </span>
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-corinto text-besh-suave transition-colors group-hover:bg-fucsia">
                <ArrowRight aria-hidden="true" className="size-4" />
              </span>
            </Link>
          </div>
        )}
      </div>
      <span aria-hidden="true" className="tejido relative" />
    </section>
  )
}
