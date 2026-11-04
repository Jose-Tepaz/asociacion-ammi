'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/utilities/ui'

type Point = { x: number; y: number }

/** Posición de un elemento dentro del contenedor, sin contar animaciones (transform). */
const offsetWithin = (el: HTMLElement, container: HTMLElement): Point | null => {
  if (!el.offsetParent) return null // oculto (display: none)
  let x = 0
  let y = 0
  let node: HTMLElement | null = el
  while (node && node !== container) {
    x += node.offsetLeft
    y += node.offsetTop
    node = node.offsetParent as HTMLElement | null
  }
  if (node !== container) return null
  return { x: x + el.offsetWidth / 2, y: y + el.offsetHeight / 2 }
}

/**
 * Dibuja líneas punteadas curvas desde cada punto `[data-dot]` de las tarjetas
 * hasta el borde del círculo `[data-ring]`. Se recalcula al cambiar el tamaño de pantalla.
 */
export const Connectors: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [paths, setPaths] = useState<string[]>([])
  const [size, setSize] = useState({ h: 0, w: 0 })

  const measure = useCallback(() => {
    const container = ref.current
    if (!container) return
    const ring = container.querySelector<HTMLElement>('[data-ring]')
    const center = ring && offsetWithin(ring, container)
    if (!ring || !center) return setPaths([])

    const radius = ring.offsetWidth / 2
    const next: string[] = []
    container.querySelectorAll<HTMLElement>('[data-dot]').forEach((dot) => {
      const start = offsetWithin(dot, container)
      if (!start) return
      // Solo si la tarjeta está al lado del círculo (diseño de 3 columnas)
      if (Math.abs(start.x - center.x) <= radius) return

      const dx = start.x - center.x
      const dy = start.y - center.y
      const len = Math.hypot(dx, dy) || 1
      const ux = dx / len
      const uy = dy / len
      const end = { x: center.x + ux * radius, y: center.y + uy * radius }
      const reach = Math.abs(start.x - end.x)
      const c1 = { x: start.x - Math.sign(dx) * reach * 0.55, y: start.y }
      const c2 = { x: end.x + ux * reach * 0.45, y: end.y + uy * reach * 0.45 }
      next.push(`M ${start.x} ${start.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${end.x} ${end.y}`)
    })
    setSize({ h: container.offsetHeight, w: container.offsetWidth })
    setPaths(next)
  }, [])

  useEffect(() => {
    measure()
    const container = ref.current
    if (!container) return
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    window.addEventListener('load', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('load', measure)
    }
  }, [measure])

  return (
    <div className={cn('relative', className)} ref={ref}>
      {paths.length > 0 && (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden lg:block"
          height={size.h}
          viewBox={`0 0 ${size.w} ${size.h}`}
          width={size.w}
        >
          {paths.map((d, i) => (
            <path
              className="stroke-corinto/25"
              d={d}
              fill="none"
              key={i}
              strokeDasharray="4 6"
              strokeLinecap="round"
              strokeWidth="1.5"
            />
          ))}
        </svg>
      )}
      {children}
    </div>
  )
}
