import React from 'react'

import type { QuoteBlock as QuoteBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

const tones = {
  corinto: 'bg-corinto text-besh-suave',
  fucsia: 'bg-fucsia text-besh-suave',
  ocre: 'bg-ocre text-texto-primario',
}

export const QuoteBlock: React.FC<QuoteBlockProps> = ({ author, image, quote, role, tone }) => {
  const hasImage = image && typeof image === 'object'

  return (
    <section className={cn(tones[tone || 'corinto'])}>
      <div className={cn('grid', hasImage && 'lg:grid-cols-12')}>
        {hasImage && (
          <div className="group relative min-h-[60svh] lg:min-h-[80svh] lg:col-span-5 overflow-hidden" data-reveal>
            <Media fill imgClassName="object-cover grayscale contrast-[1.05] transition-transform duration-500 group-hover:scale-[1.04]" resource={image} size="(max-width: 1024px) 100vw, 42vw" />
          </div>
        )}
        <figure
          className={cn(
            'container flex flex-col justify-center py-[var(--section-y)]',
            hasImage ? 'lg:col-span-7 lg:max-w-none lg:px-16 xl:px-24' : 'lg:ps-[calc(var(--margin)+41.6%)]',
          )}
        >
          <blockquote
            className="text-step-title max-w-[36ch]"
            data-reveal
            style={{ '--i': 1 } as React.CSSProperties}
          >
            <p>«{quote}»</p>
          </blockquote>
          <figcaption className="mt-10 text-step-body" data-reveal style={{ '--i': 2 } as React.CSSProperties}>
            <span className="block font-medium">{author}</span>
            {role && <span className="block opacity-90">{role}</span>}
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
