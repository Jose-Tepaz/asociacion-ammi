'use client'

import { X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { cn } from '@/utilities/ui'

import { cholqij } from './cholqij'
import { CholqijDay, NawalGlyph } from './CholqijDay'

const storageKey = 'ammi-cholqij-cerrado'

const todayInGuatemala = () => {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Guatemala' }).format(new Date())
  const [y, m, d] = parts.split('-').map(Number)
  return new Date(y!, m! - 1, d!)
}

/**
 * El día del Cholq'ij flotando en la esquina inferior derecha de todas las páginas,
 * a partir de que la persona baja media pantalla.
 * Se puede cerrar: queda como un botón redondo con el glifo y se recuerda en este navegador.
 */
export const FloatingCholqij: React.FC = () => {
  const [ready, setReady] = useState(false)
  const [open, setOpen] = useState(true)

  useEffect(() => {
    let closed = window.matchMedia('(max-width: 639px)').matches
    try {
      const saved = window.localStorage.getItem(storageKey)
      if (saved !== null) closed = saved === '1'
    } catch {
      // Sin almacenamiento disponible: se usa el valor por tamaño de pantalla
    }
    setOpen(!closed)
    // Aparece cuando la persona empieza a bajar, para no tapar la portada
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.5) {
        setReady(true)
        window.removeEventListener('scroll', onScroll)
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggle = (next: boolean) => {
    setOpen(next)
    try {
      window.localStorage.setItem(storageKey, next ? '0' : '1')
    } catch {
      // Ignorado: solo es una preferencia de esta visita
    }
  }

  if (!ready) return null
  const { glifo, nawal, numero } = cholqij(todayInGuatemala())

  return (
    <aside
      aria-label="Día del calendario maya"
      className="cholqij-float fixed bottom-4 right-4 z-40 md:bottom-6 md:right-6 print:hidden"
    >
      {open ? (
        <div className="relative">
          <CholqijDay className="w-[min(22rem,calc(100vw-2rem))] pe-10 ring-1 ring-texto-primario/5" />
          <button
            aria-label="Cerrar el día del Cholq'ij"
            className="absolute right-2 top-2 grid size-8 place-items-center rounded-full text-texto-secundario transition-colors hover:bg-besh-fuerte hover:text-texto-primario"
            onClick={() => toggle(false)}
            type="button"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>
      ) : (
        <button
          aria-label={`Hoy en el Cholq'ij: ${numero} ${nawal}. Ver significado`}
          className={cn(
            'relative grid size-14 place-items-center rounded-full bg-corinto text-ocre',
            'shadow-[0_14px_32px_-12px_rgb(36_15_22/0.6)] ring-4 ring-besh-suave transition-transform hover:-translate-y-0.5',
          )}
          onClick={() => toggle(true)}
          type="button"
        >
          <NawalGlyph className="size-9" src={glifo} />
          <span className="absolute -right-1 -top-1 grid size-6 place-items-center rounded-full bg-fucsia text-[0.75rem] font-semibold text-besh-suave ring-2 ring-besh-suave">
            {numero}
          </span>
        </button>
      )}
    </aside>
  )
}
