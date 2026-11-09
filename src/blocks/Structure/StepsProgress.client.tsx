'use client'

import React, { useEffect, useRef } from 'react'

/**
 * Recorrido de los espacios con el scroll:
 * - la línea va de centro a centro de los íconos y se rellena de corinto conforme se baja;
 * - cada espacio se «enciende» (data-active) cuando su ícono pasa la mitad de la pantalla.
 * Con «reducir movimiento» todos quedan encendidos y la línea llena.
 */
export const StepsProgress: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const steps = Array.from(root.querySelectorAll<HTMLElement>('[data-step]'))
    const track = root.querySelector<HTMLElement>('[data-track]')
    const fill = root.querySelector<HTMLElement>('[data-fill]')
    if (!steps.length || !track || !fill) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const center = (el: HTMLElement) => {
      const icon = el.querySelector<HTMLElement>('[data-icon]') || el
      const r = icon.getBoundingClientRect()
      return r.top + r.height / 2
    }

    // La línea empieza en el centro del primer ícono y termina en el del último
    const layout = () => {
      const top = root.getBoundingClientRect().top
      const first = center(steps[0]) - top
      const last = center(steps[steps.length - 1]) - top
      track.style.top = `${first}px`
      track.style.height = `${Math.max(last - first, 0)}px`
    }

    const update = () => {
      const trackTop = track.getBoundingClientRect().top
      const total = track.offsetHeight
      const line = window.innerHeight * 0.5
      const filled = reduce ? total : Math.min(Math.max(line - trackTop, 0), total)
      fill.style.height = `${filled}px`
      steps.forEach((step) => {
        step.toggleAttribute('data-active', reduce || center(step) <= line + 1)
      })
    }

    const onResize = () => {
      layout()
      update()
    }

    onResize()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div className="relative" ref={ref}>
      {children}
    </div>
  )
}
