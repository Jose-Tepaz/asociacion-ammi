import React from 'react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'

/** El cierre invierte la página: un campo de color con la idea de nuevo, en grande. */
export const CallToActionBlock: React.FC<CTABlockProps> = ({ links, richText }) => {
  return (
    <section className="bg-corinto text-besh-suave" data-theme="dark">
      <div className="container flex min-h-[70svh] md:min-h-[80svh] flex-col justify-center gap-12 py-20 md:py-28">
        {richText && (
          <div data-reveal>
            <RichText
              className="[&_h2]:text-step-display [&_h2]:m-0 [&_h2]:max-w-[14ch] [&_h3]:text-step-head [&_h3]:m-0 [&_p]:text-step-lead [&_p]:mt-10 [&_p]:max-w-[34ch] [&_p]:text-besh-fuerte"
              data={richText}
              enableGutter={false}
              enableProse={false}
            />
          </div>
        )}
        {Array.isArray(links) && links.length > 0 && (
          <div className="flex flex-col gap-3 sm:flex-row" data-reveal style={{ '--i': 1 } as React.CSSProperties}>
            {links.map(({ link }, i) => (
              <CMSLink
                className={
                  link.appearance === 'outline'
                    ? 'h-14 px-8 text-besh-suave hover:bg-besh-suave hover:text-corinto hover:border-besh-suave'
                    : 'h-14 px-8 bg-ocre text-texto-primario hover:bg-besh-suave'
                }
                key={i}
                size="lg"
                {...link}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
