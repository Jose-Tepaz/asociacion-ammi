import React from 'react'

import type { StatementBlock as StatementBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'

/** Qué somos: una declaración en letra grande, una frase con los pueblos que la integran y una foto panorámica. */
export const StatementBlock: React.FC<StatementBlockProps> = ({ heading, image, peoples, statement }) => {
  const list = peoples || []
  const hasImage = image && typeof image === 'object'
  // «mayas, garífunas, xinkas, afrodescendientes, mestizas y ladinas»
  const peoplesLine = new Intl.ListFormat('es', { type: 'conjunction' }).format(
    list.map((p) => p.name.trim().toLocaleLowerCase('es')).filter(Boolean),
  )

  return (
    <section className="container section-pad">
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
        <h2
          className="font-[family-name:var(--font-display)] text-xl font-semibold leading-tight text-corinto md:text-2xl lg:col-span-3 lg:pt-3"
          data-reveal
        >
          {heading}
        </h2>
        <div className="lg:col-span-9">
          <p
            className="max-w-[34ch] font-[family-name:var(--font-display)] text-[clamp(1.625rem,1.1rem+1.7vw,2.75rem)] font-semibold leading-[1.18] tracking-[-0.02em] text-texto-primario"
            data-reveal
            style={{ '--i': 1 } as React.CSSProperties}
          >
            {statement}
          </p>
          {peoplesLine && (
            <div className="mt-8 flex gap-5 md:mt-10" data-reveal style={{ '--i': 2 } as React.CSSProperties}>
              <span aria-hidden="true" className="mt-[0.8em] h-0.5 w-10 shrink-0 bg-ocre md:w-14" />
              <p className="max-w-[40ch] font-[family-name:var(--font-display)] text-[clamp(1.25rem,1rem+0.8vw,1.75rem)] leading-snug text-corinto">
                Somos {peoplesLine}, en una sola alianza.
              </p>
            </div>
          )}
        </div>
      </div>

      {hasImage && (
        <figure
          className="group relative mt-10 aspect-[4/3] overflow-hidden rounded-card bg-besh-oscuro sm:aspect-[16/9] md:mt-14 lg:aspect-[21/8]"
          data-reveal
          style={{ '--i': 3 } as React.CSSProperties}
        >
          <Media
            fill
            imgClassName="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            resource={image}
            size="(max-width: 1440px) 100vw, 1440px"
          />
          <span aria-hidden="true" className="tejido absolute inset-x-0 bottom-0" />
        </figure>
      )}
    </section>
  )
}
