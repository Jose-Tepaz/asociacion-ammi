import React from 'react'

import type { StatementBlock as StatementBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'

/** Qué somos: una declaración en letra grande, los pueblos que la integran y una foto panorámica. */
export const StatementBlock: React.FC<StatementBlockProps> = ({ heading, image, peoples, statement }) => {
  const list = peoples || []
  const hasImage = image && typeof image === 'object'

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
          {list.length > 0 && (
            <ul
              aria-label="Pueblos y orígenes de las mujeres de la Alianza"
              className="mt-8 flex flex-wrap gap-2 md:mt-10"
              data-reveal
              role="list"
              style={{ '--i': 2 } as React.CSSProperties}
            >
              {list.map((p, i) => (
                <li
                  className="rounded-full border border-besh-oscuro bg-white/60 px-4 py-1.5 text-step-small font-medium text-corinto"
                  key={p.id || i}
                >
                  {p.name}
                </li>
              ))}
            </ul>
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
