'use client'

import React, { useEffect, useRef } from 'react'

/**
 * Paneles que se quedan fijos y se sobreponen al hacer scroll.
 * Guarda la altura de cada panel para que uno más alto que la pantalla se lea completo antes de fijarse.
 */
export const PanelStack: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const stack = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const panels = Array.from(stack.current?.querySelectorAll<HTMLElement>(':scope > div') || [])
    const observer = new ResizeObserver((entries) => {
      entries.forEach(({ target }) => {
        const panel = target as HTMLElement
        panel.style.setProperty('--panel-h', `${panel.offsetHeight}px`)
      })
    })
    panels.forEach((panel) => observer.observe(panel))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="panel-stack" ref={stack}>
      {children}
    </div>
  )
}
