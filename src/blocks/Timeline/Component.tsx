import React from 'react'

import type { TimelineBlock as TimelineBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

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
 * Historia: texto introductorio en dos columnas y una línea de tiempo central
 * con los momentos alternados a izquierda y derecha, sobre un campo corinto oscuro.
 */
export const TimelineBlock: React.FC<TimelineBlockProps> = ({ background, events, heading, intro }) => {
  const list = events || []
  const paragraphs = (intro || '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
  const half = Math.ceil(paragraphs.length / 2)
  const columns = [paragraphs.slice(0, half), paragraphs.slice(half)].filter((c) => c.length)
  const hasBg = background && typeof background === 'object'

  return (
    <section className="section-pad relative isolate overflow-hidden bg-corinto-terciario text-besh-suave">
      {/* Fondo: foto opcional muy tenue y glifos de nawales */}
      {hasBg && (
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <Media fill imgClassName="object-cover opacity-[0.14] grayscale" resource={background} size="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-corinto-terciario via-corinto-terciario/70 to-corinto-terciario" />
        </div>
      )}
      <Glyph className="-right-24 top-16 -z-10 size-[26rem] rotate-12 opacity-[0.05] md:size-[34rem]" src="/brand/nawales/03.svg" />
      <Glyph className="-left-28 bottom-24 -z-10 size-[22rem] -rotate-12 opacity-[0.05] md:size-[30rem]" src="/brand/nawales/08.svg" />
      <Glyph className="left-[38%] top-[46%] -z-10 hidden size-56 opacity-[0.04] lg:block" src="/brand/nawales/05.svg" />

      <div className="container">
        <header data-reveal>
          <h2 className="text-step-display max-w-[14ch]">{heading}</h2>
        </header>

        {columns.length > 0 && (
          <div className="mt-8 grid gap-6 md:mt-12 lg:grid-cols-2 lg:gap-16" data-reveal style={{ '--i': 1 } as React.CSSProperties}>
            {columns.map((col, ci) => (
              <div className="space-y-5" key={ci}>
                {col.map((p, pi) => (
                  <p className="text-step-body leading-relaxed text-besh-suave/85" key={pi}>
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </div>
        )}

        {list.length > 0 && (
          <ol className="relative mt-16 grid md:mt-24 md:grid-cols-2" role="list">
            {/* Eje: línea de 2 px (a la izquierda en celular, al centro desde tablet) */}
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-[7px] w-0.5 -translate-x-1/2 bg-ocre/70 md:left-1/2"
            />

            {list.map((event, i) => {
              const right = i % 2 === 0
              return (
                <li
                  className={cn(
                    'relative pb-14 ps-10 last:pb-0 md:row-start-(--row) md:pb-20 md:ps-0',
                    right ? 'md:col-start-2 md:ps-12 lg:ps-16' : 'md:col-start-1 md:pe-12 md:text-right lg:pe-16',
                    // Cada momento entra a mitad del anterior, como en una trenza
                    i > 0 && 'md:-mt-12',
                  )}
                  data-reveal
                  key={event.id || i}
                  style={{ '--i': i + 2, '--row': i + 1 } as React.CSSProperties}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute top-[clamp(1rem,0.8rem+0.5vw,1.25rem)] left-[7px] size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ocre ring-4 ring-corinto-terciario',
                      right ? 'md:left-0' : 'md:left-auto md:right-0 md:translate-x-1/2',
                    )}
                  />
                  <p className="font-[family-name:var(--font-display)] text-[clamp(2rem,1.6rem+1vw,2.5rem)] font-semibold leading-none tracking-[-0.02em]">
                    {event.year}
                  </p>
                  <h3 className="mt-3 font-[family-name:var(--font-display)] text-xl font-semibold leading-tight text-ocre md:text-2xl">
                    {event.title}
                  </h3>
                  <p className={cn('mt-2 max-w-[42ch] text-step-body text-besh-suave/80', !right && 'md:ms-auto')}>
                    {event.text}
                  </p>
                </li>
              )
            })}
          </ol>
        )}
      </div>
    </section>
  )
}
