import React from 'react'

import type { Page } from '@/payload-types'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { cn } from '@/utilities/ui'

import { HeroVideo } from '../HighImpact/HeroVideo'
import { HeroLinks, heroTitleClasses } from '../HeroLinks'

/** Portada a toda la pantalla: la foto o el video ocupa todo el fondo, con un degradado suave bajo el texto. */
const DarkHero: React.FC<Page['hero']> = ({ kicker, links, media, richText, standfirst }) => (
  <section
    className="relative isolate flex min-h-svh items-center overflow-hidden bg-corinto-terciario text-besh-suave"
    data-hero="overlay"
    data-theme="dark"
  >
    {media && typeof media === 'object' && (
      <div className="absolute inset-0 -z-10">
        {media.mimeType?.startsWith('video/') ? (
          <HeroVideo
            className="object-top"
            controlClassName="right-6 md:bottom-6 md:top-auto"
            src={getMediaUrl(media.url, media.updatedAt)}
            type={media.mimeType}
          />
        ) : (
          <Media fill imgClassName="object-cover" priority resource={media} size="100vw" />
        )}
        <div className="absolute inset-0 bg-linear-to-r from-texto-primario/70 via-texto-primario/35 via-40% to-transparent to-70% max-lg:from-texto-primario/60 max-lg:via-texto-primario/50 max-lg:to-texto-primario/35 max-lg:to-100%" />
      </div>
    )}
    <div className="container pointer-events-none pt-32 pb-16 md:pt-36">
      <div className="pointer-events-auto max-w-[38rem]">
        {kicker && (
          <p className="fade-up mb-6 inline-flex items-center gap-2 rounded-full bg-besh-suave px-4 py-1.5 text-step-small font-medium text-corinto">
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
                  '[&_h1]:leading-[1.02] [&_em]:text-ocre',
                )}
                data={richText}
                enableGutter={false}
                enableProse={false}
              />
            </div>
          </div>
        )}
        {standfirst && <p className="fade-up mt-4 md:mt-6 lg:mt-4 text-step-lead text-besh-fuerte max-w-[40ch]">{standfirst}</p>}
        <HeroLinks className="fade-up mt-6 md:mt-8" links={links} onDark />
      </div>
    </div>
  </section>
)

/**
 * Portada corinto: etiqueta y título a la izquierda, texto (en claro) a la derecha
 * y, debajo, la foto panorámica a todo el ancho en una tarjeta con la franja de tejido.
 * La banda del encabezado toma el mismo corinto (data-hero="dark").
 */
export const MediumImpactHero: React.FC<Page['hero']> = (props) => {
  if (props.dark) return <DarkHero {...props} />

  const { kicker, links, media, richText, standfirst } = props

  return (
    <section className="overflow-hidden bg-corinto-secundario text-besh-suave" data-hero="dark" data-theme="dark">
      <div className="container grid grid-cols-1 items-center gap-12 py-[var(--section-y)] lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          {kicker && (
            <p className="fade-up mb-6 inline-flex items-center gap-2 rounded-full bg-besh-suave/10 px-4 py-1.5 text-step-small font-medium text-besh-suave">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-ocre" />
              {kicker}
            </p>
          )}
          {richText && (
            <div className="mask-line">
              <div>
                <RichText
                  className={cn(heroTitleClasses, '[&_h1]:leading-[1.02] [&_h1]:text-besh-suave [&_em]:text-ocre')}
                  data={richText}
                  enableGutter={false}
                  enableProse={false}
                />
              </div>
            </div>
          )}
          {standfirst && <p className="fade-up mt-4 md:mt-6 lg:mt-4 text-step-lead text-white/90 max-w-[40ch]">{standfirst}</p>}
          <HeroLinks className="fade-up mt-6 md:mt-8" links={links} onDark />
        </div>

        {media && typeof media === 'object' && (
          <figure className="relative lg:col-span-6 lg:ps-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-corinto-terciario">
              <Media fill imgClassName="object-cover hero-drift" priority resource={media} size="(max-width: 1024px) 100vw, 50vw" />
              <span aria-hidden="true" className="tejido absolute inset-x-0 bottom-0" />
            </div>
          </figure>
        )}
      </div>
    </section>
  )
}
