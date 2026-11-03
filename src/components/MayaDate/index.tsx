'use client'

import React, { useEffect, useState } from 'react'

import { cholqij } from './cholqij'

const formatter = new Intl.DateTimeFormat('es-GT', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'America/Guatemala',
})

const todayInGuatemala = () => {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Guatemala' }).format(new Date())
  const [y, m, d] = parts.split('-').map(Number)
  return new Date(y!, m! - 1, d!)
}

/**
 * La fecha de hoy en el Cholq'ij y en el calendario gregoriano,
 * con el mismo formato con que AMMI firma sus pronunciamientos.
 */
export const MayaDate: React.FC<{ className?: string; place?: string }> = ({
  className,
  place = 'Paxil Kayala',
}) => {
  const [today, setToday] = useState<Date | null>(null)

  useEffect(() => setToday(todayInGuatemala()), [])

  if (!today) {
    return (
      <p className={className}>
        <span>{place}, Guatemala</span>
      </p>
    )
  }

  const { nombre } = cholqij(today)

  return (
    <p className={className}>
      <time dateTime={today.toISOString().slice(0, 10)}>
        {place}, <span lang="cak">{nombre}</span>. {formatter.format(new Date())}
      </time>
    </p>
  )
}
