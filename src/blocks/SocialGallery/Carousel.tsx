'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'

const arrow =
  'grid size-12 place-items-center rounded-xl border border-texto-primario/15 bg-besh-suave text-texto-primario transition-colors hover:border-corinto hover:bg-corinto hover:text-besh-suave disabled:pointer-events-none disabled:opacity-40'

/**
 * Encabezado a la izquierda y carrusel a la derecha, que llega hasta el borde de la pantalla.
 * Se mueve con las flechas, deslizando el dedo o con el teclado, y la barra indica la posición.
 */
export const SocialCarousel: React.FC<{ children: React.ReactNode; header: React.ReactNode }> = ({
  children,
  header,
}) => {
  const track = useRef<HTMLUListElement>(null)
  const [bar, setBar] = useState({ atEnd: false, atStart: true, left: 0, overflow: false, width: 100 })

  const measure = useCallback(() => {
    const el = track.current
    if (!el) return
    const { clientWidth, scrollLeft, scrollWidth } = el
    setBar({
      atEnd: scrollLeft + clientWidth >= scrollWidth - 2,
      atStart: scrollLeft <= 2,
      left: (scrollLeft / scrollWidth) * 100,
      overflow: scrollWidth > clientWidth + 2,
      width: (clientWidth / scrollWidth) * 100,
    })
  }, [])

  useEffect(() => {
    const el = track.current
    if (!el) return
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [measure])

  const move = (direction: 1 | -1) => {
    const el = track.current
    const tile = el?.firstElementChild
    if (!el || !tile) return
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({
      behavior: calm ? 'auto' : 'smooth',
      left: direction * (tile.getBoundingClientRect().width + gap),
    })
  }

  const controls = bar.overflow && (
    <div className="flex gap-3">
      <button
        aria-label="Publicaciones anteriores"
        className={arrow}
        disabled={bar.atStart}
        onClick={() => move(-1)}
        type="button"
      >
        <ChevronLeft aria-hidden="true" className="size-5" />
      </button>
      <button
        aria-label="Publicaciones siguientes"
        className={arrow}
        disabled={bar.atEnd}
        onClick={() => move(1)}
        type="button"
      >
        <ChevronRight aria-hidden="true" className="size-5" />
      </button>
    </div>
  )

  return (
    <div className="container grid gap-10 lg:grid-cols-12 lg:gap-8">
      <div className="flex flex-col justify-between gap-8 lg:col-span-4" data-reveal>
        {header}
        <div className="hidden lg:block">{controls}</div>
      </div>

      <div className="min-w-0 lg:col-span-8" data-reveal style={{ '--i': 1 } as React.CSSProperties}>
        <ul
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto [scrollbar-width:none] lg:me-[calc(-1*max(var(--margin),calc((100vw-90rem)/2+var(--margin))))] md:gap-5 [&::-webkit-scrollbar]:hidden"
          onScroll={measure}
          ref={track}
          role="list"
        >
          {children}
        </ul>

        {bar.overflow && (
          <div aria-hidden="true" className="relative mt-8 h-1 overflow-hidden rounded-full bg-texto-primario/10">
            <span
              className="absolute inset-y-0 rounded-full bg-corinto"
              style={{ left: `${bar.left}%`, width: `${bar.width}%` }}
            />
          </div>
        )}

        <div className="mt-6 lg:hidden">{controls}</div>
      </div>
    </div>
  )
}
