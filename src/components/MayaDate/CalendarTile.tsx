'use client'

import React, { useEffect, useState } from 'react'

import { cholqij } from './cholqij'
import { NawalGlyph } from './CholqijDay'

const todayInGuatemala = () => {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Guatemala' }).format(new Date())
  const [y, m, d] = parts.split('-').map(Number)
  return new Date(y!, m! - 1, d!)
}
const monthYear = new Intl.DateTimeFormat('es-GT', { month: 'long', year: 'numeric' })
const weekday = new Intl.DateTimeFormat('es-GT', { weekday: 'long' })

/** Una hoja de calendario con la fecha de hoy y su día en el Cholq'ij. */
export const CalendarTile: React.FC = () => {
  const [today, setToday] = useState<Date | null>(null)
  useEffect(() => setToday(todayInGuatemala()), [])

  if (!today) return <div aria-hidden="true" className="aspect-[4/5] w-full max-w-[26rem] rounded-[2rem] bg-corinto" />

  const day = cholqij(today)

  return (
    <div className="relative w-full max-w-[26rem]" data-calendar-tile>
      {/* Hoja de atrás, como un taco de calendario */}
      <div aria-hidden="true" className="absolute inset-x-6 -bottom-3 top-6 rounded-[2rem] bg-besh-oscuro" />
      <div className="relative overflow-hidden rounded-[2rem] bg-corinto text-besh-suave shadow-[0_30px_60px_-30px_rgb(36_15_22/0.6)]">
        <span aria-hidden="true" className="tejido" />
        <div className="flex items-center justify-between px-7 pt-6 text-step-small">
          <span className="font-medium first-letter:uppercase">{monthYear.format(today)}</span>
          <span className="rounded-full bg-besh-suave/15 px-3 py-1 font-medium">Hoy</span>
        </div>
        <div className="px-7 pt-4">
          <p className="font-[family-name:var(--font-display)] text-[clamp(6rem,4rem+6vw,9rem)] font-semibold leading-[0.85] tracking-[-0.04em]">
            {today.getDate()}
          </p>
          <p className="mt-2 text-step-lead first-letter:uppercase">{weekday.format(today)}</p>
        </div>
        <div className="mt-8 flex items-center gap-4 bg-corinto-secundario px-7 py-6">
          <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-besh-suave/10 text-ocre">
            <NawalGlyph className="size-11" src={day.glifo} />
          </span>
          <div>
            <p className="text-step-small text-besh-oscuro">Día Cholq&apos;ij</p>
            <p className="font-[family-name:var(--font-display)] text-step-title" lang="cak">
              {day.numero} {day.nawal}
            </p>
            <p className="text-step-small text-besh-fuerte">{day.significado}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
