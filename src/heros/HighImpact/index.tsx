import configPromise from '@payload-config'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import type { Page, Post } from '@/payload-types'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
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

type TextNode = { children?: TextNode[]; tag?: string; text?: string; type?: string }

/** El texto del primer encabezado, para animar el título palabra por palabra. */
const headingWords = (richText: Page['hero']['richText']) => {
  const root = richText?.root as TextNode | undefined
  const heading = root?.children?.find((node) => node.type === 'heading')
  const read = (node?: TextNode): string =>
    node?.text ?? (node?.children || []).map(read).join('')
  return read(heading).split(/\s+/).filter(Boolean)
}

/**
 * Portada del inicio: la foto o el video queda fijo a pantalla completa mientras el texto sube.
 * El título va a la izquierda y, en computadora, el texto y un solo botón a su derecha.
 * El último pronunciamiento va en una tarjeta en la parte baja.
 * El menú es transparente sobre esta portada y se vuelve una barra blanca al bajar (ver globals.css).
 */
export const HighImpactHero: React.FC<Page['hero']> = async ({
  featured,
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
  const words = headingWords(richText)

  return (
    <section
      className="relative isolate h-[115svh] bg-corinto-terciario text-besh-suave"
      data-hero="overlay"
      data-theme="dark"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="absolute inset-0">
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
        </div>
        {/* Oscurece la foto, más hacia abajo, para que el texto se lea sobre cualquier imagen */}
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/25"
        />
        {/* Oscurece la franja del menú para que sus textos blancos se lean */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/60 to-transparent"
        />
        <span aria-hidden="true" className="hero-intro absolute inset-0 bg-white" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex h-[100svh] flex-col justify-end max-lg:justify-center">
        <div className="container flex flex-col items-start pb-10 pt-28 md:pt-32 lg:grid lg:grid-cols-12 lg:items-end lg:gap-10 lg:pb-36">
          <div className="lg:col-span-8">
            {words.length > 0 ? (
              <h1 className="text-step-display font-normal leading-[1.04] text-besh-suave md:max-w-[20ch] lg:max-w-[24ch] lg:text-step-hero">
                {words.map((word, i) => (
                  <React.Fragment key={i}>
                    <span className="hero-word" style={{ '--i': i } as React.CSSProperties}>
                      {word}
                    </span>{' '}
                  </React.Fragment>
                ))}
              </h1>
            ) : (
              richText && (
                <RichText
                  className={cn(heroTitleClasses, '[&_h1]:font-normal [&_h1]:text-besh-suave')}
                  data={richText}
                  enableGutter={false}
                  enableProse={false}
                />
              )
            )}
          </div>

          <div className="mt-4 md:mt-6 lg:col-span-4 lg:mt-0">
            {standfirst && (
              <p className="hero-rise text-step-lead max-w-[44ch]">{standfirst}</p>
            )}
            <HeroLinks
              className="hero-rise pointer-events-auto mt-6 lg:mt-8"
              links={links?.slice(0, 1)}
              onDark
            />
          </div>
        </div>
      </div>

      {/* Va fijo con la foto. A la derecha deja libre la esquina donde flota el calendario */}
      {post && (
        <div className="pointer-events-none absolute inset-0">
          <div className="sticky top-0 h-[100svh]">
            <Link
              className="hero-rise group pointer-events-auto absolute bottom-5 left-[var(--margin)] z-10 flex w-[calc(100%-var(--margin)-6rem)] max-w-[20rem] items-center gap-3 rounded-xl bg-besh-suave p-2 pe-3 text-left text-texto-primario shadow-[0_24px_48px_-20px_rgb(0_0_0/0.55)] transition-transform hover:-translate-y-1 lg:left-auto lg:right-[calc(var(--margin)+5rem)] lg:w-full lg:max-w-[17rem]"
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
              </span>
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-corinto text-besh-suave transition-colors group-hover:bg-fucsia">
                <ArrowRight aria-hidden="true" className="size-3.5" />
              </span>
            </Link>
          </div>
        </div>
      )}
    </section>
  )
}
