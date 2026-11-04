'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Marca con `is-in` cada elemento `[data-reveal]` cuando entra en pantalla, una sola vez.
 * Los de `data-reveal="circle"` se cierran al volver a quedar por debajo de la pantalla.
 */
export const RevealObserver = () => {
  const pathname = usePathname()

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)'))
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement
          const reversible = el.dataset.reveal === 'circle'
          if (entry.isIntersecting) {
            el.classList.add('is-in')
            if (!reversible) io.unobserve(el)
          } else if (reversible && entry.boundingClientRect.top > 0) {
            el.classList.remove('is-in')
          }
        })
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [pathname])

  return null
}
