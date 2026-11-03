'use client'

import { ArrowUpRight, Clock, MapPin, Users } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'

import type { AgendaBlock as AgendaBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { cholqij } from '@/components/MayaDate/cholqij'
import { NawalGlyph } from '@/components/MayaDate/CholqijDay'
import { cn } from '@/utilities/ui'

const dayKey = (iso: string) => iso.slice(0, 10)
const toLocalDate = (key: string) => {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y!, m! - 1, d!)
}
const todayKey = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Guatemala' }).format(new Date())

const weekday = new Intl.DateTimeFormat('es-GT', { weekday: 'long' })
const monthYear = new Intl.DateTimeFormat('es-GT', { month: 'short', year: 'numeric' })
const fullDate = new Intl.DateTimeFormat('es-GT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

type Event = NonNullable<AgendaBlockProps['events']>[number]

export const AgendaBlock: React.FC<AgendaBlockProps & { id?: string | null }> = ({
  action,
  events,
  heading,
  headingSecond,
  id,
}) => {
  const days = useMemo(() => {
    const groups = new Map<string, Event[]>()
    for (const event of events || []) {
      if (!event?.date) continue
      const key = dayKey(event.date)
      groups.set(key, [...(groups.get(key) || []), event])
    }
    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [events])

  // Se abre en el próximo día con actividades; si todos pasaron, en el último
  const [today, setToday] = useState<string | null>(null)
  const [active, setActive] = useState(0)
  useEffect(() => {
    const t = todayKey()
    setToday(t)
    const next = days.findIndex(([key]) => key >= t)
    setActive(next === -1 ? Math.max(days.length - 1, 0) : next)
  }, [days])

  const [activeKey, sessions = []] = days[active] || []
  const activeDate = activeKey ? toLocalDate(activeKey) : null
  const activeDay = activeDate ? cholqij(activeDate) : null
  const isPast = Boolean(today && activeKey && activeKey < today)

  return (
    <section className="container">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between" data-reveal>
        <h2 className="text-step-head">
          {headingSecond ? (
            <>
              <span className="block text-corinto">{heading}</span>
              <span className="block">{headingSecond}</span>
            </>
          ) : (
            heading
          )}
        </h2>
        {action?.enabled && action.link?.label && (
          <CMSLink appearance="default" className="self-start md:self-auto" size="lg" {...action.link} />
        )}
      </div>

      {days.length > 0 && (
        <div
          className="mt-10 md:mt-14 grid gap-5 lg:grid-cols-[17rem_1fr] lg:gap-8"
          data-reveal
          style={{ '--i': 1 } as React.CSSProperties}
        >
          <div aria-label="Días con actividades" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:flex lg:flex-col" role="tablist">
            {days.map(([key], i) => {
              const date = toLocalDate(key)
              const day = cholqij(date)
              const isActive = i === active
              return (
                <button
                  aria-controls={`agenda-${id}-panel`}
                  aria-selected={isActive}
                  className={cn(
                    'flex items-center gap-4 rounded-card p-4 text-left transition-colors',
                    isActive ? 'bg-corinto text-besh-suave' : 'bg-besh-fuerte hover:bg-besh-oscuro',
                  )}
                  id={`agenda-${id}-tab-${i}`}
                  key={key}
                  onClick={() => setActive(i)}
                  role="tab"
                  type="button"
                >
                  <span className="font-[family-name:var(--font-display)] text-[2.75rem] font-semibold leading-none tracking-[-0.03em]">
                    {date.getDate()}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-step-small font-medium first-letter:uppercase">{weekday.format(date)}</span>
                    <span className={cn('block text-step-small', isActive ? 'text-besh-fuerte' : 'text-texto-secundario')}>
                      {monthYear.format(date)}
                    </span>
                    <span
                      className={cn('mt-1 flex items-center gap-1.5 text-step-small', isActive ? 'text-ocre' : 'text-corinto')}
                      lang="cak"
                    >
                      <NawalGlyph className="size-4 shrink-0" src={day.glifo} />
                      {day.numero} {day.nawal}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>

          <div
            aria-labelledby={`agenda-${id}-tab-${active}`}
            className="rounded-card bg-besh-fuerte p-4 sm:p-6 md:p-8"
            id={`agenda-${id}-panel`}
            role="tabpanel"
          >
            {activeDate && activeDay && (
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <p className="text-step-body font-medium first-letter:uppercase">
                  {fullDate.format(activeDate)}
                  <span className="text-texto-secundario" lang="cak">
                    {' '}
                    · {activeDay.numero} {activeDay.nawal}
                  </span>
                </p>
                {today && (
                  <span
                    className={cn(
                      'inline-flex h-8 items-center rounded-full px-3.5 text-step-small font-medium',
                      isPast ? 'bg-besh-oscuro text-texto-secundario' : 'bg-fucsia text-besh-suave',
                    )}
                  >
                    {isPast ? 'Realizada' : 'Próximamente'}
                  </span>
                )}
              </div>
            )}

            <ul className="flex flex-col gap-3" role="list">
              {sessions.map((event, i) => (
                <li
                  className="grid gap-4 rounded-2xl bg-besh-suave p-5 md:grid-cols-[9rem_1fr_auto] md:items-start md:gap-6 md:p-6"
                  key={event.id || i}
                >
                  {event.time && (
                    <p className="flex items-center gap-2 text-step-body font-medium tabular-nums text-corinto">
                      <Clock aria-hidden="true" className="size-4 shrink-0" />
                      {event.time}
                    </p>
                  )}
                  <div className={cn('min-w-0', !event.time && 'md:col-span-2')}>
                    {event.kind && (
                      <span className="mb-2 inline-flex h-7 items-center rounded-full bg-ocre/25 px-3 text-step-small font-medium text-corinto-terciario">
                        {event.kind}
                      </span>
                    )}
                    <h3 className="text-step-title">{event.title}</h3>
                    <div className="mt-3 flex flex-col gap-1.5 text-step-small text-texto-secundario">
                      {event.place && (
                        <p className="flex items-start gap-2">
                          <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-fucsia" />
                          {event.place}
                        </p>
                      )}
                      {event.people && (
                        <p className="flex items-start gap-2">
                          <Users aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-fucsia" />
                          {event.people}
                        </p>
                      )}
                    </div>
                  </div>
                  {event.url && (
                    <a
                      className="inline-flex h-10 items-center gap-1.5 self-start rounded-full border-[1.5px] border-corinto/40 px-4 text-step-small font-medium text-corinto transition-colors hover:border-corinto hover:bg-corinto hover:text-besh-suave"
                      href={event.url}
                    >
                      Más información
                      <ArrowUpRight aria-hidden="true" className="size-4" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  )
}
