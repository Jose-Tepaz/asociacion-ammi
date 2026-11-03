import { ArrowRight, Users } from 'lucide-react'
import React from 'react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

/** Invitación a sumarse: panel corinto con el texto a un lado y la foto al otro. */
export const CallToActionBlock: React.FC<CTABlockProps> = ({ backgroundImage, links, note, richText }) => {
  const hasImage = backgroundImage && typeof backgroundImage === 'object'

  return (
    <section className="container">
      <div
        className="relative overflow-hidden rounded-[2rem] bg-corinto text-besh-suave"
        data-reveal
        data-theme="dark"
      >
        <span aria-hidden="true" className="tejido" />
        <div className={cn('grid gap-10 p-6 sm:p-10 md:p-14', hasImage && 'lg:grid-cols-2 lg:items-center lg:gap-14')}>
          <div className={cn(!hasImage && 'max-w-[44rem]')}>
            {richText && (
              <RichText
                className="[&_h2]:text-step-head [&_h2]:m-0 [&_h2]:max-w-[16ch] [&_h3]:text-step-title [&_h3]:m-0 [&_p]:text-step-lead [&_p]:mt-5 [&_p]:max-w-[38ch] [&_p]:text-besh-fuerte"
                data={richText}
                enableGutter={false}
                enableProse={false}
              />
            )}
            {Array.isArray(links) && links.length > 0 && (
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                {links.map(({ link }, i) => (
                  <CMSLink
                    className={
                      link.appearance === 'outline'
                        ? 'border-besh-suave/60 text-besh-suave hover:bg-besh-suave hover:border-besh-suave hover:text-corinto'
                        : 'bg-ocre text-texto-primario hover:bg-besh-suave'
                    }
                    key={i}
                    size="lg"
                    {...link}
                  >
                    {link.appearance !== 'outline' && <ArrowRight aria-hidden="true" />}
                  </CMSLink>
                ))}
              </div>
            )}
          </div>

          {hasImage && (
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-corinto-secundario">
                <Media
                  fill
                  imgClassName="object-cover"
                  resource={backgroundImage}
                  size="(max-width: 1024px) 90vw, 40vw"
                />
              </div>
              {note && (
                <p className="absolute -bottom-4 left-4 sm:left-6 flex items-center gap-3 rounded-2xl bg-besh-suave px-4 py-3 text-step-small font-medium text-texto-primario shadow-[0_18px_40px_-18px_rgb(0_0_0/0.5)]">
                  <span className="grid size-9 place-items-center rounded-full bg-fucsia text-besh-suave">
                    <Users aria-hidden="true" className="size-4" />
                  </span>
                  {note}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
