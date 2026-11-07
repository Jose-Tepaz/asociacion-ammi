'use client'

import React, { useEffect, useRef } from 'react'

/**
 * Celular y tablet: las tarjetas se «encienden» solas con el scroll (marca data-active),
 * con el mismo efecto que el hover de escritorio (ver .mission-card en globals.css).
 * - Celular: se enciende al entrar desde abajo (bajando) y se apaga al volver a salir por abajo (subiendo).
 * - Tablet: se enciende mientras pasa por la franja central de la pantalla.
 */
export const ScrollActive: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const mobile = window.matchMedia('(max-width: 47.999rem)')
    const tablet = window.matchMedia('(min-width: 48rem) and (max-width: 63.999rem)')
    const cards = Array.from(root.querySelectorAll<HTMLElement>('.mission-card'))
    let io: IntersectionObserver | null = null

    const setup = () => {
      io?.disconnect()
      cards.forEach((c) => c.removeAttribute('data-active'))
      if (!mobile.matches && !tablet.matches) return
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            entry.target.toggleAttribute('data-active', entry.isIntersecting)
          })
        },
        // Celular: línea a 3/4 de la pantalla. Tablet: franja central.
        { rootMargin: mobile.matches ? '0px 0px -25% 0px' : '-35% 0px -35% 0px' },
      )
      cards.forEach((c) => io!.observe(c))
    }

    setup()
    mobile.addEventListener('change', setup)
    tablet.addEventListener('change', setup)
    return () => {
      io?.disconnect()
      mobile.removeEventListener('change', setup)
      tablet.removeEventListener('change', setup)
    }
  }, [])

  return <div ref={ref}>{children}</div>
}
