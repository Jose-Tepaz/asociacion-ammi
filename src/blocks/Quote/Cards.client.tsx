'use client'

import React, { useState } from 'react'

export type QuoteSlide = {
  quote: string
  author: string
  role?: string | null
  /** Retrato ya preparado en el servidor (o un marcador si no hay foto). */
  portrait: React.ReactNode
}

/**
 * Tarjeta de tres columnas: retrato | nombre y contexto | cita.
 * Con más de una voz aparecen el contador «01 / 02» y las flechas; las voces se cruzan con un fundido.
 * Todas las voces ocupan la misma celda, así la tarjeta no cambia de alto al pasar de una a otra.
 */
export const QuoteCards: React.FC<{ accent: string; slides: QuoteSlide[] }> = ({ accent, slides }) => {
  const [current, setCurrent] = useState(0)
  const total = slides.length
  const many = total > 1
  const pad = (n: number) => String(n).padStart(2, '0')
  const go = (step: number) => setCurrent((c) => (c + step + total) % total)

  return (
    <div className="grid">
      {slides.map((slide, i) => {
        const isCurrent = i === current
        return (
          <figure
            aria-hidden={!isCurrent}
            className={
              'grid overflow-hidden rounded-card border border-current/15 transition-opacity duration-500 ease-out [grid-area:1/1] motion-reduce:transition-none ' +
              'md:grid-cols-[minmax(0,5fr)_minmax(0,4fr)] lg:grid-cols-[minmax(0,4fr)_minmax(0,3fr)_minmax(0,6fr)] ' +
              (isCurrent ? 'opacity-100' : 'pointer-events-none opacity-0')
            }
            inert={!isCurrent}
            key={i}
          >
            <div className="group relative aspect-[4/5] overflow-hidden md:row-span-2 md:aspect-auto md:min-h-[26rem] lg:row-span-1 lg:min-h-[32rem]">
              {slide.portrait}
            </div>

            {/* Nombre y contexto; con varias voces, también el contador y las flechas */}
            <figcaption className="order-last flex flex-col justify-between gap-6 border-current/15 p-6 md:order-none md:p-8 lg:border-r">
              <div>
                {many && (
                  <p className={'mb-4 text-sm tabular-nums tracking-wide ' + accent}>
                    ({pad(i + 1)} / {pad(total)})
                  </p>
                )}
                <span className="block font-[family-name:var(--font-display)] text-xl font-semibold leading-tight md:text-2xl">
                  {slide.author}
                </span>
              </div>
              <div>
                {slide.role && <span className="block text-step-body opacity-80">{slide.role}</span>}
                {many && (
                  <div className="mt-6 flex gap-2">
                    <button
                      aria-label="Voz anterior"
                      className="grid size-10 place-items-center border border-current/30 transition-colors hover:bg-current/10"
                      onClick={() => go(-1)}
                      type="button"
                    >
                      ←
                    </button>
                    <button
                      aria-label="Voz siguiente"
                      className="grid size-10 place-items-center border border-current/30 transition-colors hover:bg-current/10"
                      onClick={() => go(1)}
                      type="button"
                    >
                      →
                    </button>
                  </div>
                )}
              </div>
            </figcaption>

            <blockquote className="flex flex-col justify-center p-6 md:col-start-2 md:p-8 lg:col-start-auto lg:p-12">
              <span aria-hidden="true" className={'font-[family-name:var(--font-display)] text-6xl leading-none ' + accent}>
                “
              </span>
              <p className="mt-2 font-[family-name:var(--font-display)] text-[clamp(1.5rem,1rem+1.6vw,2.5rem)] font-semibold leading-[1.15]">
                {slide.quote}
              </p>
            </blockquote>
          </figure>
        )
      })}
    </div>
  )
}
