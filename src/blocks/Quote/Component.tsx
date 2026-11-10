import React from 'react'

import type { QuoteBlock as QuoteBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

import { QuoteCards } from './Cards.client'

const portraitOf = (image: QuoteBlockProps['image']) =>
  image && typeof image === 'object' ? (
    <Media
      fill
      imgClassName="object-cover grayscale contrast-[1.05] transition-transform duration-500 group-hover:scale-[1.04]"
      resource={image}
      size="(max-width: 768px) 100vw, (max-width: 1024px) 55vw, 32vw"
    />
  ) : null

/**
 * Voz (cita): tarjeta de tres columnas, retrato | nombre, cargo y fuente | cita.
 *
 * Con «Más voces» la tarjeta pasa a ser un carrusel con contador y flechas.
 *
 * `onBackdrop`: la cita va justo después de la línea de tiempo y comparte su foto de fondo fija,
 * así que no pinta fondo propio (ver RenderBlocks).
 */
export const QuoteBlock: React.FC<QuoteBlockProps & { onBackdrop?: boolean }> = ({
  author,
  image,
  moreVoices,
  onBackdrop,
  quote,
  role,
  source,
}) => {
  // Siempre corinto con acento ocre (el campo «Color de fondo» quedó oculto en el admin)
  const toneClass = onBackdrop ? 'text-besh-suave' : 'bg-corinto text-besh-suave'
  const accent = 'text-ocre'
  const slides = [{ author, image, quote, role, source }, ...(moreVoices || [])].map((voice) => ({
    author: voice.author,
    portrait: portraitOf(voice.image),
    quote: voice.quote,
    role: voice.role,
    source: voice.source,
  }))

  return (
    <section className={cn(toneClass, 'py-[var(--section-y)]')}>
      <div className="container" data-reveal>
        <QuoteCards
          accent={accent}
          // Sobre la foto de la historia, la tarjeta lleva fondo corinto oscuro para leerse como un bloque
          cardClassName={onBackdrop ? 'bg-corinto-terciario' : ''}
          slides={slides}
        />
      </div>
    </section>
  )
}
