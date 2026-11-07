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
 * Historia: título e introducción y, debajo, los hitos. Desde tablet el año queda fijo a la
 * derecha y cambia al llegar a cada hito; el fondo (foto tenue y nawales) queda quieto a pantalla completa.
 */
export const TimelineBlock: React.FC<TimelineBlockProps> = ({ background, events, heading, intro }) => {
  const list = events || []
  const paragraphs = (intro || '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
  const hasBg = background && typeof background === 'object'

  return (
    <section className="section-pad relative isolate overflow-x-clip bg-corinto-terciario text-besh-suave">
      {/* Fondo fijo: ocupa toda la pantalla y se queda quieto mientras se recorre la sección,
          para que lo que se mueva sean los hitos y el año */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="sticky top-0 h-svh overflow-hidden">
          {hasBg && (
            <Media fill imgClassName="object-cover opacity-[0.16] grayscale" resource={background} size="100vw" />
          )}
          <Glyph className="-right-24 top-16 size-[26rem] rotate-12 opacity-[0.05] md:size-[34rem]" src="/brand/nawales/03.svg" />
          <Glyph className="-left-28 bottom-8 size-[22rem] -rotate-12 opacity-[0.05] md:size-[30rem]" src="/brand/nawales/08.svg" />
          <Glyph className="left-[38%] top-[40%] hidden size-56 opacity-[0.04] lg:block" src="/brand/nawales/05.svg" />
        </div>
      </div>

      <div className="container">
        <header className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-12">
          <h2 className="text-step-display max-w-[14ch] lg:col-span-5" data-reveal>
            {heading}
          </h2>
          {paragraphs.length > 0 && (
            <div className="space-y-5 lg:col-span-7 lg:pt-3" data-reveal style={{ '--i': 1 } as React.CSSProperties}>
              {paragraphs.map((p, pi) => (
                <p className="text-step-body leading-relaxed text-besh-suave/85" key={pi}>
                  {p}
                </p>
              ))}
            </div>
          )}
        </header>

        {list.length > 0 && (
          <div className="mt-10 md:mt-16">
            <TimelineSteps events={list.map(({ id, text, title, year }) => ({ id, text, title, year }))} />
          </div>
        )}
      </div>
    </section>
  )
}
