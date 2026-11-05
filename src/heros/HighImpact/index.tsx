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
    // Solo publicaciones publicadas: nunca mostrar borradores en la portada
    overrideAccess: false,
    where: { _status: { equals: 'published' } },
  })
  return docs[0] || null
}

/**
 * Portada del inicio: la foto o el video a pantalla completa, con título, texto y botones
 * centrados en la parte baja. El último pronunciamiento va en la esquina inferior derecha.
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
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-corinto-terciario text-besh-suave"
      data-hero="overlay"
      data-theme="dark"
    >
      {/* La foto o el video ocupa toda la pantalla, por debajo de la barra de navegación */}
      <div className="absolute inset-0 -z-10">
        {resource &&
          (isVideo ? (
            <HeroVideo
              className="object-[50%_35%]"
              controlClassName="bottom-auto top-24 md:top-28"
              src={getMediaUrl(resource.url, resource.updatedAt)}
              type={resource.mimeType}
            />
          ) : (
            <Media
              fill
              imgClassName="object-cover object-[50%_35%]"
              priority
              resource={resource}
              size="100vw"
            />
          ))}
        {/* Oscurece la foto, más hacia abajo, para que el texto se lea sobre cualquier imagen */}
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/5"
        />
      </div>

      <div className="container flex flex-col items-center pb-12 pt-32 text-center md:pb-20 xl:pb-32">
        {kicker && (
          <p className="fade-up mb-5 inline-flex items-center gap-2 rounded-full bg-besh-suave/15 px-4 py-1.5 text-step-small font-medium text-besh-suave backdrop-blur-sm">
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
                  '[&_h1]:leading-[1.04] [&_h1]:mx-auto [&_h1]:max-w-[24ch] [&_h1]:text-besh-suave [&_p]:mx-auto',
                )}
                data={richText}
                enableGutter={false}
                enableProse={false}
              />
            </div>
          </div>
        )}
        {standfirst && <p className="mt-5 text-step-lead max-w-[52ch] fade-up">{standfirst}</p>}
        <HeroLinks className="mt-6 justify-center fade-up" links={links} onDark />
      </div>

      {post && (
        <div className="container flex justify-center pb-6 xl:absolute xl:bottom-0 xl:right-0 xl:w-auto xl:p-6">
          <Link
            className="group fade-up flex w-full max-w-[20rem] xl:max-w-[17rem] items-center gap-3 rounded-xl bg-besh-suave p-2 pe-3 text-left text-texto-primario shadow-[0_24px_48px_-20px_rgb(0_0_0/0.55)] transition-transform hover:-translate-y-1"
            href={`/posts/${post.slug}`}
          >
            {thumb && (
              <span className="relative block h-14 w-11 shrink-0 overflow-hidden rounded-md bg-besh-fuerte">
                <Media fill imgClassName="object-cover object-top" resource={thumb} size="44px" />
              </span>
            )}
            <span className="min-w-0 flex-1">
              <span className="block text-step-small font-medium text-fucsia">
                {featured?.label || 'Nuevo pronunciamiento'}
              </span>
              <span className="mt-0.5 block font-[family-name:var(--font-display)] text-step-small font-semibold leading-snug line-clamp-2">
                {post.title}
              </span>
              {post.publishedAt && (
                <span className="mt-0.5 block text-step-small text-texto-secundario">
                  {formatDateLong(post.publishedAt)}
                </span>
              )}
            </span>
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-corinto text-besh-suave transition-colors group-hover:bg-fucsia">
              <ArrowRight aria-hidden="true" className="size-3.5" />
            </span>
          </Link>
        </div>
      )}
    </section>
  )
}
