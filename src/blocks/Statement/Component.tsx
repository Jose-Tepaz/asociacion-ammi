import React from 'react'

import type { StatementBlock as StatementBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

/**
 * Qué somos: mosaico de tarjetas con el mismo lenguaje que «Cuatro ejes» del inicio.
 * Una tarjeta corinto grande con la declaración, la foto y una tarjeta ocre con la línea de pueblos.
 * En celular la tarjeta ocre va antes que la foto; en tablet la foto y la tarjeta ocre comparten fila.
 */
export const StatementBlock: React.FC<StatementBlockProps> = ({ heading, image, peoplesLine, statement }) => {
  const hasImage = image && typeof image === 'object'

  return (
    <section className="container section-pad">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-12">
        {/* Declaración */}
        <article
          className={cn(
            'relative flex flex-col justify-center gap-6 overflow-hidden rounded-card bg-corinto px-6 pb-8 pt-10 text-besh-suave md:px-10 md:pb-12 md:pt-14 lg:px-14',
            hasImage || peoplesLine ? 'md:col-span-2 lg:col-span-7 lg:row-span-2' : 'md:col-span-2 lg:col-span-12',
          )}
          data-reveal
        >
          <span aria-hidden="true" className="tejido absolute inset-x-0 top-0" />
          {/* Detalle de esquina, como en las tarjetas de los ejes */}
          <span
            aria-hidden="true"
            className="absolute -bottom-16 -right-16 size-48 rounded-full bg-current/5 md:size-64"
          />
          <h2 className="kicker uppercase tracking-[0.18em] !text-ocre">{heading}</h2>
          <p className="relative max-w-[26ch] font-[family-name:var(--font-display)] text-[clamp(1.5rem,1.05rem+1.7vw,2.625rem)] font-semibold leading-[1.15] tracking-[-0.015em]">
            {statement}
          </p>
        </article>

        {/* Foto */}
        {hasImage && (
          <figure
            className="group relative order-3 h-[clamp(20rem,50vh,30rem)] overflow-hidden rounded-card bg-besh-oscuro md:order-none md:h-auto md:min-h-[20rem] lg:col-span-5"
            data-reveal
            style={{ '--i': 1 } as React.CSSProperties}
          >
            <Media
              fill
              imgClassName="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              resource={image}
              size="(max-width: 1024px) 100vw, 42vw"
            />
          </figure>
        )}

        {/* Pueblos */}
        {peoplesLine && (
          <div
            className={cn(
              'relative flex items-end overflow-hidden rounded-card bg-ocre p-6 text-texto-primario md:p-8',
              hasImage ? 'lg:col-span-5' : 'md:col-span-2 lg:col-span-12',
            )}
            data-reveal
            style={{ '--i': 2 } as React.CSSProperties}
          >
            {/* Solo en tablet: glifo del logo (la parte izquierda de ammi-mark) de fondo, en corinto tenue */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-6 -top-6 hidden h-48 w-44 bg-corinto/15 md:block lg:hidden"
              style={{
                maskImage: 'url(/brand/ammi-mark-ink.png)',
                maskRepeat: 'no-repeat',
                maskSize: 'auto 100%',
                maskPosition: 'left center',
                WebkitMaskImage: 'url(/brand/ammi-mark-ink.png)',
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskSize: 'auto 100%',
                WebkitMaskPosition: 'left center',
              }}
            />
            <p className="relative font-[family-name:var(--font-display)] text-[clamp(1.125rem,0.95rem+0.6vw,1.5rem)] font-semibold leading-snug">
              {peoplesLine}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
