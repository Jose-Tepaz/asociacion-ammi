import React from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'

import { heroTitleClasses } from '../HeroLinks'

type LowImpactHeroType =
  | {
      children?: React.ReactNode
      richText?: never
      standfirst?: never
    }
  | (Omit<Page['hero'], 'richText'> & {
      children?: never
      richText?: Page['hero']['richText']
    })

export const LowImpactHero: React.FC<LowImpactHeroType> = ({ children, richText, standfirst }) => {
  return (
    <section className="container grid grid-cols-1 gap-y-8 pt-16 pb-16 md:pt-24 md:pb-24 lg:grid-cols-12 lg:gap-x-8">
      {standfirst && (
        <p className="order-2 lg:order-1 lg:col-span-4 text-step-lead max-w-[30ch] fade-up">{standfirst}</p>
      )}
      <div className="order-1 lg:order-2 lg:col-span-7 lg:col-start-6 mask-line">
        <div className={heroTitleClasses}>
          {children || (richText && <RichText data={richText} enableGutter={false} enableProse={false} />)}
        </div>
      </div>
    </section>
  )
}
