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
 * Portada del inicio: título a la izquierda, texto y botones a la derecha y, debajo, la foto o
 * el video a todo el ancho. El último pronunciamiento va en la esquina inferior derecha.
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
      className="relative flex min-h-[calc(100svh-var(--header-h))] flex-col overflow-hidden bg-background"
      data-hero="light"
    >
      <div className="container grid gap-6 pt-10 md:pt-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          {kicker && (
            <p className="fade-up mb-6 inline-flex items-center gap-2 rounded-full bg-corinto/10 px-4 py-1.5 text-step-small font-medium text-fucsia">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-fucsia" />
              {kicker}
            </p>
          )}
          {richText && (
            <div className="mask-line">
              <div>
                <RichText
                  className={cn(
                    heroTitleClasses,
                    '[&_h1]:leading-[1.04] [&_h1]:max-w-[20ch] [&_h1]:text-corinto',
                  )}
                  data={richText}
                  enableGutter={false}
                  enableProse={false}
                />
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 lg:self-center lg:pt-14">
          {standfirst && <p className="text-step-lead max-w-[36ch] fade-up">{standfirst}</p>}
          <HeroLinks className="mt-6 fade-up" links={links} />
        </div>
      </div>

      {/* Escena a todo el ancho: la foto o el video sube fundiéndose con el fondo */}
      <div className="relative mt-6 min-h-[22rem] flex-1 [mask-image:linear-gradient(to_bottom,transparent,black_28%)] md:min-h-[26rem]">
        {resource &&
          (isVideo ? (
            <HeroVideo
              className="object-[50%_35%]"
              controlClassName="md:bottom-6 md:top-auto"
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
      </div>

      {post && (
        <div className="container relative -mt-24 pb-6 lg:absolute lg:bottom-0 lg:right-0 lg:mt-0 lg:flex lg:w-auto lg:justify-end lg:p-6">
          <Link
            className="group fade-up flex w-full max-w-[20rem] items-center gap-3 rounded-xl bg-besh-suave p-2 pe-3 text-left text-texto-primario shadow-[0_24px_48px_-20px_rgb(0_0_0/0.55)] transition-transform hover:-translate-y-1"
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
