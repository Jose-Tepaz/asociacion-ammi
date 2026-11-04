'use client'

import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'

import { cn } from '@/utilities/ui'

type Item = { id?: string | null; label: string; heading: string; text: string }

// useLayoutEffect en el navegador, useEffect en el servidor (evita el aviso de React)
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/** Pestañas de Misión / Visión / Valor. La sección mide lo que el texto activo necesita. */
export const MissionTabs: React.FC<{ items: Item[] }> = ({ items }) => {
  const [active, setActive] = useState(0)
  const [bar, setBar] = useState({ left: 0, width: 0 })
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const baseId = useId()
  const current = items[active]

  const placeBar = useCallback(() => {
    const el = tabs.current[active]
    if (el) setBar({ left: el.offsetLeft, width: el.offsetWidth })
  }, [active])

  useIsoLayoutEffect(() => {
    placeBar()
  }, [placeBar])

  useEffect(() => {
    window.addEventListener('resize', placeBar)
    return () => window.removeEventListener('resize', placeBar)
  }, [placeBar])

  // Flechas izquierda/derecha, Inicio y Fin mueven entre pestañas
  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = items.length - 1
    const next =
      e.key === 'ArrowRight' ? (active === last ? 0 : active + 1)
      : e.key === 'ArrowLeft' ? (active === 0 ? last : active - 1)
      : e.key === 'Home' ? 0
      : e.key === 'End' ? last
      : null
    if (next === null) return
    e.preventDefault()
    setActive(next)
    tabs.current[next]?.focus()
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
      <h2
        className="animate-in fade-in slide-in-from-bottom-3 font-[family-name:var(--font-display)] text-[clamp(2.75rem,1.6rem+5.2vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.03em] text-corinto duration-500 motion-reduce:animate-none"
        key={`h-${active}`}
      >
        {current.heading}
      </h2>

      <div
        aria-label="Misión, visión y valor"
        className="relative mt-10 flex flex-wrap justify-center gap-x-2 border-b border-besh-oscuro md:mt-12 md:gap-x-4"
        onKeyDown={onKeyDown}
        role="tablist"
      >
        {items.map((item, i) => (
          <button
            aria-controls={`${baseId}-panel`}
            aria-selected={i === active}
            className={cn(
              'relative px-4 pb-3 pt-1 text-step-body font-medium transition-colors duration-200 md:px-6',
              'rounded-t-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fucsia',
              i === active ? 'text-corinto' : 'text-texto-secundario/70 hover:text-texto-primario',
            )}
            id={`${baseId}-tab-${i}`}
            key={item.id || i}
            onClick={() => setActive(i)}
            ref={(el) => {
              tabs.current[i] = el
            }}
            role="tab"
            tabIndex={i === active ? 0 : -1}
            type="button"
          >
            {item.label}
          </button>
        ))}
        <span
          aria-hidden="true"
          className="absolute bottom-[-1px] h-0.5 rounded-full bg-corinto transition-[left,width] duration-300 ease-[var(--ease-out)] motion-reduce:transition-none"
          style={{ left: bar.left, width: bar.width }}
        />
      </div>

      <p
        aria-labelledby={`${baseId}-tab-${active}`}
        className="animate-in fade-in slide-in-from-bottom-2 mt-8 w-full max-w-4xl text-step-lead text-texto-primario duration-500 motion-reduce:animate-none md:mt-10"
        id={`${baseId}-panel`}
        key={`p-${active}`}
        role="tabpanel"
      >
        {current.text}
      </p>
    </div>
  )
}
