import React from 'react'

import type { Media as MediaType, Page } from '@/payload-types'

import { Media } from '@/components/Media'
import { MayaDate } from '@/components/MayaDate'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

import { HeroLinks, heroTitleClasses } from '../HeroLinks'

const Photo: React.FC<{ className?: string; resource?: MediaType | number | null; priority?: boolean }> = ({
  className,
  priority,
  resource,
}) => {
  if (!resource || typeof resource !== 'object') return <div className={cn('bg-besh-oscuro', className)} />
  return (
    <div className={cn('relative overflow-hidden bg-besh-oscuro', className)}>
      <Media
        fill
        imgClassName="object-cover grayscale contrast-[1.05] hero-drift"
        priority={priority}
        resource={resource}
        size="(max-width: 768px) 66vw, 33vw"
      />
    </div>
  )
}

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, mosaic, richText, standfirst }) => {
  const [b, c, d] = (mosaic || []).map((row) => row?.image)

  return (
    <section className="relative">
      {/* Masthead: mosaico sin separaciones de imágenes y bloques planos de color */}
      <div
        className="grid h-[38svh] md:h-[52svh] min-h-[16rem] grid-cols-3 grid-rows-2 md:grid-cols-6 [grid-template-areas:'a_a_t''y_d_z'] md:[grid-template-areas:'a_a_t_b_y_c''k_d_t_z_z_c']"
      >
        <Photo className="[grid-area:a]" priority resource={media} />
        <div className="[grid-area:t] bg-fucsia" />
        <Photo className="hidden md:block [grid-area:b]" resource={b} />
        <div className="[grid-area:y] bg-ocre" />
        <Photo className="hidden md:block [grid-area:c]" resource={c} />
        <div className="hidden md:block [grid-area:k] bg-corinto" />
        <Photo className="[grid-area:d]" resource={d ?? b} />
        <div className="[grid-area:z] bg-corinto-terciario text-besh-suave flex items-end p-4 md:p-6">
          <div className="hidden md:block">
            <p className="text-step-small text-besh-oscuro">Hoy en el Cholq&apos;ij</p>
            <MayaDate className="text-step-lead leading-tight mt-1 max-w-[22ch]" />
          </div>
        </div>
      </div>

      <div className="container grid grid-cols-1 gap-y-8 pt-12 pb-[var(--section-gap)] md:pt-[6.5rem] lg:grid-cols-12 lg:gap-x-8">
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
    </section>
  )
}
