import React from 'react'

import type { IntroBlock as IntroBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'

export const IntroBlock: React.FC<IntroBlockProps> = ({ body, facts, heading, image }) => {
  return (
    <section className="container">
      <div className="grid grid-cols-1 gap-y-6 lg:grid-cols-12 lg:gap-x-8 lg:items-end">
        <h2 className="lg:col-span-6 text-step-head" data-reveal>
          {heading}
        </h2>
        <p
          className="lg:col-span-4 lg:col-start-9 text-step-body max-w-[42ch] whitespace-pre-line"
          data-reveal
          style={{ '--i': 1 } as React.CSSProperties}
        >
          {body}
        </p>
      </div>

      {Array.isArray(facts) && facts.length > 0 && (
        <dl className="mt-20 md:mt-28 grid grid-cols-2 gap-x-6 gap-y-10 md:flex md:justify-between md:gap-10">
          {facts.map(({ id, label, value }, i) => (
            <div data-reveal key={id} style={{ '--i': i + 2 } as React.CSSProperties}>
              <dt className="sr-only">{label}</dt>
              <dd className="text-step-head text-corinto">
                {value}
              </dd>
              <dd className="mt-3 text-step-small text-muted-foreground max-w-[22ch]">{label}</dd>
            </div>
          ))}
        </dl>
      )}

      {image && typeof image === 'object' && (
        <div className="mt-16 grid lg:grid-cols-12 lg:gap-x-8">
          <div className="relative aspect-[4/3] overflow-hidden bg-besh-oscuro lg:col-span-6 lg:col-start-7" data-reveal>
            <Media fill imgClassName="object-cover" resource={image} size="(max-width: 1024px) 100vw, 50vw" />
          </div>
        </div>
      )}
    </section>
  )
}
