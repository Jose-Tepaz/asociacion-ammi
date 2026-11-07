'use client'

import React, { useEffect, useRef, useState } from 'react'

type Event = { id?: string | null; year: string; title: string; text: string }

/**
 * Hitos con el año fijo (sticky) a la derecha.
 * La columna izquierda se desplaza normal; cuando un hito llega a la mitad de la pantalla,
 * el año de la derecha cambia deslizándose hacia arriba.
 * En celular no hay columna fija: cada hito lleva su año arriba.
 */
export const TimelineSteps: React.FC<{ events: Event[] }> = ({ events }) => {
  const [active, setActive] = useState(0)
  const items = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    // Se activa el hito que cruza la línea media de la pantalla
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index))
        })
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )
    items.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [events.length])

  return (
    <div className="relative grid grid-cols-1 md:grid-cols-2 md:gap-10">
      <ol className="relative" role="list">
        {events.map((event, i) => (
          <li
            className="flex flex-col justify-center py-10 md:min-h-[75svh] md:py-0"
            data-index={i}
            key={event.id || i}
            ref={(el) => {
              items.current[i] = el
            }}
          >
            {/* Año solo en celular */}
            <p className="font-[family-name:var(--font-display)] text-[4rem] font-semibold leading-none tracking-[-0.03em] text-ocre md:hidden">
              {event.year}
            </p>
            <h3
              className={
                'mt-3 font-[family-name:var(--font-display)] text-[clamp(1.75rem,1.2rem+1.8vw,3rem)] font-semibold leading-[1.05] transition-opacity duration-500 md:mt-0 ' +
                (i === active ? 'md:opacity-100' : 'md:opacity-40')
              }
            >
              {event.title}
            </h3>
            <p
              className={
                'mt-4 max-w-[44ch] text-step-body leading-relaxed text-besh-suave/85 transition-opacity duration-500 ' +
                (i === active ? 'md:opacity-100' : 'md:opacity-40')
              }
            >
              {event.text}
            </p>
          </li>
        ))}
      </ol>

      {/* Año fijo: se queda en pantalla y cambia con cada hito (desde tablet) */}
      <div aria-hidden="true" className="hidden md:block">
        <div className="sticky top-0 flex h-svh items-center justify-end">
          <div className="h-[0.9em] overflow-hidden font-[family-name:var(--font-display)] text-[clamp(7rem,3rem+10vw,15rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-ocre">
            <div
              className="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
              style={{ transform: `translateY(${-active * 0.9}em)` }}
            >
              {events.map((event, i) => (
                <p className="h-[0.9em] text-right" key={event.id || i}>
                  {event.year}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
