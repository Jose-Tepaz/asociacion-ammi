'use client'

import React, { useMemo, useState } from 'react'

import type { AgendaBlock as AgendaBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { cholqij } from '@/components/MayaDate/cholqij'
import { cn } from '@/utilities/ui'

const dayKey = (iso: string) => iso.slice(0, 10)
const toLocalDate = (key: string) => {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y!, m! - 1, d!)
}
const weekday = new Intl.DateTimeFormat('es-GT', { weekday: 'long' })
const dayMonth = new Intl.DateTimeFormat('es-GT', { day: 'numeric', month: 'long', year: 'numeric' })

export const AgendaBlock: React.FC<AgendaBlockProps & { id?: string | null }> = ({
  action,
  events,
  heading,
  headingSecond,
  id,
}) => {
  const days = useMemo(() => {
    const groups = new Map<string, NonNullable<AgendaBlockProps['events']>>()
    for (const event of events || []) {
      if (!event?.date) continue
      const key = dayKey(event.date)
      groups.set(key, [...(groups.get(key) || []), event])
    }
    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [events])

  const [active, setActive] = useState(0)
  const [, sessions = []] = days[active] || []

  return (
    <section className="container">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <h2 className="text-step-head" data-reveal>
          {headingSecond ? (
            <>
              <span className="block text-muted-foreground">{heading}</span>
              <span className="block">{headingSecond}</span>
            </>
          ) : (
            heading
          )}
        </h2>
        {action?.link?.label && (
          <div data-reveal style={{ '--i': 1 } as React.CSSProperties}>
            <CMSLink appearance="default" className="w-full md:w-auto" size="lg" {...action.link} />
          </div>
        )}
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-[11rem_1fr] md:gap-10" data-reveal style={{ '--i': 2 } as React.CSSProperties}>
        <div
          aria-label="Días"
          className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:flex md:flex-col"
          role="tablist"
        >
          {days.map(([key], i) => {
            const date = toLocalDate(key)
            const isActive = i === active
            return (
              <button
                aria-controls={`agenda-${id}-panel`}
                aria-selected={isActive}
                className={cn(
                  'px-4 py-3 text-left transition-colors',
                  isActive ? 'bg-corinto-terciario text-besh-suave' : 'bg-besh-fuerte hover:bg-besh-oscuro',
                )}
                id={`agenda-${id}-tab-${i}`}
                key={key}
                onClick={() => setActive(i)}
                role="tab"
                type="button"
              >
                <span className="block text-step-body font-medium first-letter:uppercase">{weekday.format(date)}</span>
                <span className="block text-step-small">{dayMonth.format(date)}</span>
                <span className={cn('block text-step-small', isActive ? 'text-ocre' : 'text-corinto')} lang="cak">
                  {cholqij(date).nombre}
                </span>
              </button>
            )
          })}
        </div>

        <ul
          aria-labelledby={`agenda-${id}-tab-${active}`}
          className="flex flex-col gap-1"
          id={`agenda-${id}-panel`}
          role="tabpanel"
        >
          {sessions.map((event, i) => {
            const body = (
              <>
                <span className="text-step-body font-medium tabular-nums md:w-40 shrink-0">{event.time}</span>
                <span className="flex-1 min-w-0">
                  <span className="block text-step-body font-medium leading-snug">{event.title}</span>
                  {(event.kind || event.place) && (
                    <span className="block mt-1 text-step-small text-muted-foreground">
                      {[event.kind, event.place].filter(Boolean).join(' · ')}
                    </span>
                  )}
                </span>
                {event.people && (
                  <span className="text-step-small md:text-right md:max-w-[16rem]">{event.people}</span>
                )}
              </>
            )
            const classes = cn(
              'flex flex-col gap-2 px-5 py-5 md:flex-row md:items-center md:gap-8 md:px-6',
              i % 2 === 0 ? 'bg-besh-fuerte' : 'bg-besh-oscuro/60',
            )
            return (
              <li key={event.id || i}>
                {event.url ? (
                  <a className={cn(classes, 'transition-colors hover:bg-ocre/40')} href={event.url}>
                    {body}
                  </a>
                ) : (
                  <div className={classes}>{body}</div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
