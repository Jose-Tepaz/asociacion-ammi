import React from 'react'

import type { Page } from '@/payload-types'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

import { HeroLinks, heroTitleClasses } from '../HeroLinks'

export const MediumImpactHero: React.FC<Page['hero']> = ({ links, media, richText, standfirst }) => {
  return (
    <section>
      <div className="container grid grid-cols-1 gap-y-8 pt-16 pb-16 md:pt-24 md:pb-20 lg:grid-cols-12 lg:gap-x-8">
        {standfirst && (
          <p className="order-2 lg:order-1 lg:row-span-2 lg:col-span-4 text-step-lead max-w-[30ch] fade-up">
            {standfirst}
          </p>
        )}
        <div className="order-1 lg:order-2 lg:col-span-7 lg:col-start-6">
          {richText && (
            <div className="mask-line">
              <div>
                <RichText
                  className={heroTitleClasses}
                  data={richText}
                  enableGutter={false}
                  enableProse={false}
                />
              </div>
            </div>
          )}
        </div>
        <HeroLinks className="order-3 lg:col-span-7 lg:col-start-6 lg:mt-2 fade-up" links={links} />
      </div>
      {media && typeof media === 'object' && (
        <figure className="mb-[var(--section-gap)]">
          <div className="relative h-[60svh] min-h-[20rem] overflow-hidden bg-besh-oscuro">
            <Media fill imgClassName="object-cover hero-drift" priority resource={media} size="100vw" />
          </div>
          {media.caption && (
            <figcaption className="container mt-4 text-step-small text-muted-foreground">
              <RichText data={media.caption} enableGutter={false} enableProse={false} />
            </figcaption>
          )}
        </figure>
      )}
    </section>
  )
}
