import React from 'react'

import type { QuoteBlock as QuoteBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

import { QuoteCards } from './Cards.client'

const tones = {
  corinto: 'bg-corinto text-besh-suave',
  fucsia: 'bg-fucsia text-besh-suave',
  ocre: 'bg-ocre text-texto-primario',
}

/**
 * Voz (cita): tarjeta de tres columnas, retrato | nombre y contexto | cita.
 *
 * `onBackdrop`: la cita va justo después de la línea de tiempo y comparte su foto de fondo fija,
 * así que no pinta fondo propio (ver RenderBlocks).
 */
export const QuoteBlock: React.FC<QuoteBlockProps & { onBackdrop?: boolean }> = ({
  author,
  image,
  onBackdrop,
  quote,
  role,
  tone,
}) => {
  const hasImage = image && typeof image === 'object'
  const toneClass = onBackdrop ? 'text-besh-suave' : tones[tone || 'corinto']
  const accent = !onBackdrop && tone === 'ocre' ? 'text-corinto' : 'text-ocre'

  const portrait = hasImage ? (
    <Media
      fill
      imgClassName="object-cover grayscale contrast-[1.05] transition-transform duration-500 group-hover:scale-[1.04]"
      resource={image}
      size="(max-width: 768px) 100vw, (max-width: 1024px) 55vw, 32vw"
    />
  ) : null

  return (
    <section className={cn(toneClass, 'py-[var(--section-y)]')}>
      <div className="container" data-reveal>
        <QuoteCards
          accent={accent}
          // Sobre la foto de la historia, la tarjeta lleva fondo corinto oscuro para leerse como un bloque
          cardClassName={onBackdrop ? 'bg-corinto-terciario' : ''}
          slides={[{ quote, author, role, portrait }]}
        />
      </div>
    </section>
  )
}
