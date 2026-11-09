import React from 'react'

import type { TimelineBlock as TimelineBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

import { TimelineSteps } from './Steps.client'

/** Glifos de los nawales (calendario Cholq'ij) como fondo, muy tenues. */
const Glyph: React.FC<{ src: string; className: string }> = ({ className, src }) => (
  <span
    aria-hidden="true"
    className={cn('pointer-events-none absolute bg-besh-suave', className)}
    style={{
      maskImage: `url(${src})`,
      maskRepeat: 'no-repeat',
      maskSize: 'contain',
      maskPosition: 'center',
      WebkitMaskImage: `url(${src})`,
      WebkitMaskRepeat: 'no-repeat',
      WebkitMaskSize: 'contain',
      WebkitMaskPosition: 'center',
    }}
  />
)

/**
 * Fondo fijo de la historia: foto tenue y nawales a pantalla completa. Se queda quieto mientras se
 * recorre el contenedor que lo tiene, para que lo que se mueva sean los hitos y el año.
 * Va en la propia sección o, si la sigue una cita, en un contenedor que envuelve a las dos (RenderBlocks).
 */
export const TimelineBackdrop: React.FC<{ background: TimelineBlockProps['background'] }> = ({ background }) => {
  const hasBg = background && typeof background === 'object'
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      <div className="sticky top-0 h-svh overflow-hidden">
        {hasBg && <Media fill imgClassName="object-cover opacity-[0.16] grayscale" resource={background} size="100vw" />}
        {/* Un solo nawal (Tz'i'), grande y recortado por la derecha, detrás del año: con la foto ya basta */}
        <Glyph
          className="-right-32 top-1/2 size-[24rem] -translate-y-1/2 rotate-[8deg] opacity-[0.06] md:-right-40 md:size-[40rem]"
          src="/brand/nawales/10-lineas.svg"
        />
      </div>
    </div>
  )
}

/**
 * Historia: título e introducción y, debajo, los hitos. Desde tablet el año queda fijo a la
 * derecha y cambia al llegar a cada hito; el fondo (foto tenue y nawales) queda quieto a pantalla completa.
 * `sharedBackdrop`: el fondo lo pone el contenedor que comparte con la cita siguiente.
 */
export const TimelineBlock: React.FC<TimelineBlockProps & { sharedBackdrop?: boolean }> = ({
  background,
  events,
  heading,
  intro,
  sharedBackdrop,
}) => {
  const list = events || []
  const paragraphs = (intro || '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  return (
    <section
      className={cn(
        'section-pad relative isolate overflow-x-clip text-besh-suave',
        !sharedBackdrop && 'bg-corinto-terciario',
      )}
      // Con la cita debajo es una sola sección: sin espacio abajo, la cita sigue directo
      style={sharedBackdrop ? { paddingBottom: 0 } : undefined}
    >
      {!sharedBackdrop && <TimelineBackdrop background={background} />}

      <div className="container">
        {/* Primero la historia: título arriba y, debajo, los textos repartidos en dos columnas */}
        <header>
          <h2 className="text-step-display max-w-[18ch]" data-reveal>
            {heading}
          </h2>
          {paragraphs.length > 0 && (
            <div
              className="mt-8 gap-x-12 md:mt-12 md:columns-2 lg:gap-x-16"
              data-reveal
              style={{ '--i': 1 } as React.CSSProperties}
            >
              {paragraphs.map((p, pi) => (
                <p className="mb-5 break-inside-avoid text-step-body leading-relaxed text-besh-suave/85" key={pi}>
                  {p}
                </p>
              ))}
            </div>
          )}
        </header>

        {list.length > 0 && (
          <div className="mt-6 md:mt-8">
            <TimelineSteps events={list.map(({ id, text, title, year }) => ({ id, text, title, year }))} />
          </div>
        )}
      </div>
    </section>
  )
}
