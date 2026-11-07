import { Eye, HeartHandshake, type LucideIcon, Sparkles, Target } from 'lucide-react'
import React from 'react'

import type { MissionBlock as MissionBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'

import { MissionTabs } from './Tabs.client'

type Item = { id?: string | null; label: string; heading: string; subtitle?: string | null; text: string }

// Misión, visión, valor y uno extra, en ese orden
const icons: LucideIcon[] = [Target, Eye, HeartHandshake, Sparkles]

/**
 * Versión en tarjetas, con el mismo lenguaje que «Cuatro ejes» y «Cómo nos organizamos»:
 * ícono en la esquina (donde los ejes llevan el número), título, frase y texto.
 * Celular: una debajo de otra. Tablet: dos por fila (la tercera ocupa la fila completa).
 * Escritorio: todas en una fila.
 */
const MissionRows: React.FC<{ items: Item[] }> = ({ items }) => (
  <ul
    className={cn(
      'grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5',
      items.length === 3 && 'lg:grid-cols-3',
      items.length === 4 && 'lg:grid-cols-4',
    )}
    role="list"
  >
    {items.map((item, i) => {
      const Icon = icons[i] || Sparkles
      const Title = i === 0 ? 'h2' : 'h3'
      const lastAlone = items.length % 2 === 1 && i === items.length - 1
      return (
        <li
          className={cn(
            'relative flex flex-col overflow-hidden rounded-card border border-besh-oscuro bg-white p-6 md:p-8 lg:p-10',
            lastAlone && 'md:col-span-2 lg:col-span-1',
          )}
          data-reveal
          key={item.id || i}
          style={{ '--i': i } as React.CSSProperties}
        >
          {/* Ícono en la esquina, en el lugar donde las tarjetas de los ejes llevan el número */}
          <span
            aria-hidden="true"
            className="absolute right-0 top-0 grid size-24 place-items-start justify-end rounded-bl-full bg-corinto/10 pe-5 pt-5 text-corinto md:size-28 md:pe-6 md:pt-6"
          >
            <Icon className="size-7 md:size-8" strokeWidth={1.75} />
          </span>
          <Title className="pe-20 text-step-head text-corinto md:pe-24">{item.label}</Title>
          {item.subtitle && (
            <p className="mt-2 pe-20 font-[family-name:var(--font-display)] text-lg font-semibold leading-snug text-texto-primario md:pe-24 md:text-xl">
              {item.subtitle}
            </p>
          )}
          <p className="mt-4 text-step-body leading-relaxed text-texto-secundario">{item.text}</p>
        </li>
      )
    })}
  </ul>
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
