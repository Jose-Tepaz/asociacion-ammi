import { Scale } from 'lucide-react'
import React from 'react'

import type { IntroBlock as IntroBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

/** Presentación: foto vertical a un lado y, al otro, el texto con las cifras en una fila. */
export const IntroBlock: React.FC<IntroBlockProps> = ({ body, facts, heading, highlight, image, kicker }) => {
  const list = Array.isArray(facts) ? facts : []
  const hasImage = image && typeof image === 'object'
  const firstFact = list.find((f) => /^\d{4}$/.test(f.value))

  return (
    <section className="container">
      <div className={cn('grid items-center gap-12 lg:gap-16', hasImage && 'lg:grid-cols-12')}>
        {hasImage && (
          <figure className="relative lg:col-span-5" data-reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-besh-oscuro">
              <Media fill imgClassName="object-cover" resource={image} size="(max-width: 1024px) 100vw, 40vw" />
              <span aria-hidden="true" className="tejido absolute inset-x-0 bottom-0" />
            </div>
            {firstFact && (
              <figcaption className="absolute left-5 top-5 rounded-full bg-besh-suave/95 px-4 py-2 text-step-small font-medium text-corinto">
                Desde {firstFact.value}
              </figcaption>
            )}
          </figure>
        )}

        <div className={cn(hasImage ? 'lg:col-span-7' : 'max-w-[52rem]')}>
          <div data-reveal>
            {kicker && <p className="kicker mb-3">{kicker}</p>}
            <h2 className="text-step-head text-corinto max-w-[18ch]">{heading}</h2>
          </div>
          <p
            className="mt-6 text-step-lead max-w-[40ch] whitespace-pre-line"
            data-reveal
            style={{ '--i': 1 } as React.CSSProperties}
          >
            {body}
          </p>
          {highlight && (
            <p
              className="mt-8 flex items-center gap-4 text-step-body text-texto-secundario"
              data-reveal
              style={{ '--i': 2 } as React.CSSProperties}
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-fucsia/10 text-fucsia">
                <Scale aria-hidden="true" className="size-5" />
              </span>
              <span className="max-w-[40ch]">{highlight}</span>
            </p>
          )}

          {list.length > 0 && (
            <dl
              className="mt-12 grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3"
              data-reveal
              style={{ '--i': 3 } as React.CSSProperties}
            >
              {list.map(({ id, label, value }) => (
                <div className="flex flex-col-reverse border-s-2 border-ocre ps-5" key={id}>
                  <dt className="mt-2 text-step-small text-texto-secundario max-w-[20ch]">{label}</dt>
                  <dd className="font-[family-name:var(--font-display)] text-step-head font-semibold leading-none text-corinto">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </section>
  )
}
