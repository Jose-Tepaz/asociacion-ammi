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
 * Portada del inicio: la foto o el video ocupan todo el fondo, con un velo oscuro
 * para leer el texto. El contenido va centrado y el último pronunciamiento en la esquina derecha.
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
        {/* Velo oscuro neutro y parejo: no tiñe los colores de la foto */}
        <div className="absolute inset-0 bg-texto-primario/55" />
      </div>

      <div className="container flex flex-1 flex-col items-center justify-center gap-10 pt-36 pb-[var(--section-y)] text-center">
        <div className="flex flex-col items-center">
          {kicker && (
            <p className="fade-up mb-6 inline-flex items-center gap-2 rounded-full bg-besh-suave px-4 py-1.5 text-step-small font-semibold text-corinto">
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
                    '[&_h1]:text-[clamp(2.5rem,1.2rem+3.6vw,4.75rem)] [&_h1]:leading-[1.04] [&_h1]:max-w-[24ch]',
                  )}
                  data={richText}
                  enableGutter={false}
                  enableProse={false}
                />
              </div>
            </div>
          )}
          {standfirst && (
            <p className="mt-6 text-step-lead text-besh-fuerte max-w-[52ch] fade-up">{standfirst}</p>
          )}
          <HeroLinks className="mt-10 justify-center fade-up" links={links} onDark />
        </div>

        {post && (
          <div className="flex w-full justify-center lg:absolute lg:right-6 lg:bottom-6 lg:w-80">
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
                <span className="block text-[0.75rem] font-medium text-fucsia">
                  {featured?.label || 'Nuevo pronunciamiento'}
                </span>
                <span className="mt-0.5 block font-[family-name:var(--font-display)] text-step-small font-semibold leading-snug line-clamp-2">
                  {post.title}
                </span>
                {post.publishedAt && (
                  <span className="mt-0.5 block text-[0.75rem] text-texto-secundario">
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
      </div>
    </section>
  )
}
