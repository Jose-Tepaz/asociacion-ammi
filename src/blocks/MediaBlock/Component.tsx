import type { StaticImageData } from 'next/image'

import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import type { MediaBlock as MediaBlockProps } from '@/payload-types'

import { getOptimizedImageUrl } from '@/utilities/getOptimizedImageUrl'

import { Media } from '../../components/Media'

type Props = MediaBlockProps & {
  breakout?: boolean
  captionClassName?: string
  className?: string
  enableGutter?: boolean
  imgClassName?: string
  staticImage?: StaticImageData
  disableInnerContainer?: boolean
}

export const MediaBlock: React.FC<Props> = (props) => {
  const {
    captionClassName,
    className,
    enableGutter = true,
    imgClassName,
    media,
    staticImage,
    disableInnerContainer,
    fullBleed,
    overlayAuthor,
    overlayText,
  } = props

  let caption
  if (media && typeof media === 'object') caption = media.caption

  // Sin texto encima, la foto queda fija y la página se desliza sobre ella
  if (fullBleed && media && typeof media === 'object' && !overlayText) {
    return (
      <figure className={className}>
        <div
          aria-label={media.alt || undefined}
          className="h-[60svh] min-h-[22rem] bg-besh-oscuro bg-cover bg-center md:h-[40rem] md:bg-fixed"
          role="img"
          style={{ backgroundImage: `url("${getOptimizedImageUrl(media.url, media.updatedAt, 1920)}")` }}
        />
        <span aria-hidden="true" className="tejido" />
      </figure>
    )
  }

  if (fullBleed && media && typeof media === 'object') {
    return (
      <figure
        className={cn('relative isolate', className)}
        data-reveal="circle"
        data-theme={overlayText ? 'dark' : undefined}
      >
        <div className="relative h-[64svh] min-h-[22rem] md:h-[78svh] overflow-hidden bg-besh-oscuro">
          {/* Encuadre alto: las caras suelen estar arriba y el texto va abajo */}
          <Media
            fill
            imgClassName="object-cover object-[50%_15%] hero-drift min-[100rem]:object-[50%_24%]"
            resource={media}
            size="100vw"
          />
          {overlayText && (
            // Velo neutro solo bajo el texto, para que se lea sobre cualquier foto
            <div className="absolute inset-0 bg-linear-to-t from-corinto-terciario/90 via-corinto-terciario/35 to-transparent" />
          )}
        </div>
        {overlayText && (
          <blockquote className="absolute inset-x-0 bottom-0 text-besh-suave">
            <div className="container pb-10 md:pb-16" data-reveal style={{ '--i': 8 } as React.CSSProperties}>
              <p className="font-[family-name:var(--font-display)] text-step-head max-w-[22ch]">
                {overlayText}
              </p>
              {overlayAuthor && (
                <footer className="mt-5 flex items-center gap-3 text-step-body text-besh-fuerte">
                  <span aria-hidden="true" className="h-0.5 w-8 rounded-full bg-ocre" />
                  {overlayAuthor}
                </footer>
              )}
            </div>
          </blockquote>
        )}
        <span aria-hidden="true" className="tejido" />
        {caption && (
          <figcaption className="container mt-4 text-step-small text-muted-foreground">
            <RichText data={caption} enableGutter={false} enableProse={false} />
          </figcaption>
        )}
      </figure>
    )
  }

  return (
    <figure
      className={cn(
        '',
        {
          container: enableGutter,
        },
        className,
      )}
      data-reveal
    >
      {(media || staticImage) && (
        <Media imgClassName={cn('w-full rounded-card', imgClassName)} resource={media} src={staticImage} />
      )}
      {caption && (
        <figcaption
          className={cn(
            'mt-4 text-step-small text-muted-foreground',
            {
              container: !disableInnerContainer,
            },
            captionClassName,
          )}
        >
          <RichText data={caption} enableGutter={false} enableProse={false} />
        </figcaption>
      )}
    </figure>
  )
}
