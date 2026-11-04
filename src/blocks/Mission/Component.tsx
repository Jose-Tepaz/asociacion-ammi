import { Eye, HeartHandshake, type LucideIcon, Sparkles, Target } from 'lucide-react'
import React from 'react'

import type { MissionBlock as MissionBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'

import { MissionTabs } from './Tabs.client'

type Item = { id?: string | null; label: string; heading: string; subtitle?: string | null; text: string }

// Misión, visión, valor y uno extra, en ese orden
const icons: LucideIcon[] = [Target, Eye, HeartHandshake, Sparkles]

/**
 * Ilustración vectorial: anillo con cuatro puntos ocre (giran al desplazar la pantalla)
 * y un círculo corinto con el ícono al centro.
 */
const Emblem: React.FC<{ Icon: LucideIcon }> = ({ Icon }) => (
  <div className="relative mx-auto aspect-square w-full max-w-[16rem] md:max-w-[22rem]">
    <svg aria-hidden="true" className="absolute inset-0 size-full text-corinto" viewBox="0 0 360 360">
      <circle cx="180" cy="180" fill="none" r="148" stroke="currentColor" strokeWidth="5" />
      <g stroke="currentColor" strokeLinecap="round" strokeWidth="5">
        <line x1="180" x2="180" y1="10" y2="40" />
        <line x1="320" x2="350" y1="180" y2="180" />
        <line x1="180" x2="180" y1="320" y2="350" />
        <line x1="10" x2="40" y1="180" y2="180" />
      </g>
      <g
        className="emblem-orbit fill-ocre"
      >
        <circle cx="180" cy="32" r="22" />
        <circle cx="328" cy="180" r="22" />
        <circle cx="180" cy="328" r="22" />
        <circle cx="32" cy="180" r="22" />
      </g>
      <circle cx="180" cy="180" fill="currentColor" r="96" />
    </svg>
    <Icon
      aria-hidden="true"
      className="absolute left-1/2 top-1/2 size-[24%] -translate-x-1/2 -translate-y-1/2 text-besh-suave"
      strokeWidth={1.75}
    />
  </div>
)

/** Versión en filas: texto e ilustración, alternando el lado en cada fila. */
const MissionRows: React.FC<{ items: Item[] }> = ({ items }) => (
  <div className="space-y-16 md:space-y-24 lg:space-y-28">
    {items.map((item, i) => {
      const flip = i % 2 === 1
      const Title = i === 0 ? 'h2' : 'h3'
      return (
        <article
          className="group grid items-center gap-10 md:grid-cols-2 md:gap-12 lg:gap-20"
          data-reveal
          key={item.id || i}
        >
          <div className={cn(flip && 'md:order-2')}>
            <Title className="text-step-display text-corinto">{item.label}</Title>
            {item.subtitle && (
              <p className="mt-3 font-[family-name:var(--font-display)] text-xl font-semibold leading-snug text-texto-primario md:text-2xl">
                {item.subtitle}
              </p>
            )}
            <p className="mt-5 max-w-[56ch] text-step-body leading-relaxed text-texto-secundario">{item.text}</p>
          </div>
          <div className={cn(flip && 'md:order-1')}>
            <Emblem Icon={icons[i] || Sparkles} />
          </div>
        </article>
      )
    })}
  </div>
)

/** Misión, visión y valor: en pestañas con un título grande o en filas con ilustración. */
export const MissionBlock: React.FC<MissionBlockProps> = ({ items, layout }) => {
  const list = (items || []).map(({ heading, id, label, subtitle, text }) => ({ heading, id, label, subtitle, text }))
  if (list.length === 0) return null

  return (
    <section className="container section-pad" data-reveal={layout === 'rows' ? undefined : true}>
      {layout === 'rows' ? <MissionRows items={list} /> : <MissionTabs items={list} />}
    </section>
  )
}
