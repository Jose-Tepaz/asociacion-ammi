'use client'

import React, { useEffect, useState } from 'react'

import { cn } from '@/utilities/ui'

import { cholqij } from './cholqij'

const todayInGuatemala = () => {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Guatemala' }).format(new Date())
  const [y, m, d] = parts.split('-').map(Number)
  return new Date(y!, m! - 1, d!)
}

/** El glifo del nawal pintado en el color del texto, para que tome los colores de la marca. */
export const NawalGlyph: React.FC<{ className?: string; src: string }> = ({ className, src }) => (
  <span
    aria-hidden="true"
    className={cn('block bg-current', className)}
    style={{
      maskImage: `url(${src})`,
      WebkitMaskImage: `url(${src})`,
      maskSize: 'contain',
      WebkitMaskSize: 'contain',
      maskRepeat: 'no-repeat',
      WebkitMaskRepeat: 'no-repeat',
      maskPosition: 'center',
      WebkitMaskPosition: 'center',
    }}
  />
)

/**
 * El día de hoy en el Cholq'ij: glifo del nawal, número y nombre, y su significado.
 * `card` es la tarjeta clara de la portada; `inline` es la versión compacta del pie.
 */
export const CholqijDay: React.FC<{ className?: string; variant?: 'card' | 'inline' }> = ({
  className,
  variant = 'card',
}) => {
  const [today, setToday] = useState<Date | null>(null)
  useEffect(() => setToday(todayInGuatemala()), [])

  if (!today) {
    return <div aria-hidden="true" className={cn(variant === 'card' ? 'h-[5.5rem] w-72' : 'h-8', className)} />
  }

  const { glifo, nawal, nombre, numero, significado } = cholqij(today)

  if (variant === 'inline') {
    return (
      <p className={cn('flex items-center gap-3', className)} title={significado}>
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-besh-suave/10 text-ocre">
          <NawalGlyph className="size-5" src={glifo} />
        </span>
        <span>
          Día Cholq&apos;ij: <span lang="cak">{numero} {nawal}</span> · {significado}
        </span>
      </p>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-2xl bg-besh-suave p-3 pe-5 text-texto-primario shadow-[0_18px_40px_-18px_rgb(0_0_0/0.5)]',
        className,
      )}
    >
      <span className="relative grid size-16 shrink-0 place-items-center rounded-xl bg-corinto text-ocre">
        <NawalGlyph className="size-11" src={glifo} />
        <span className="absolute -bottom-1.5 -right-1.5 grid size-6 place-items-center rounded-full bg-fucsia text-[0.75rem] font-semibold text-besh-suave ring-2 ring-besh-suave">
          {numero}
        </span>
      </span>
      <span className="min-w-0">
        <span className="block text-step-small text-texto-secundario">Día Cholq&apos;ij</span>
        <span className="block font-[family-name:var(--font-display)] text-step-lead font-semibold leading-tight" lang="cak" title={nombre}>
          {numero} {nawal}
        </span>
        <span className="mt-0.5 block text-step-small text-texto-secundario">{significado}</span>
      </span>
    </div>
  )
}
