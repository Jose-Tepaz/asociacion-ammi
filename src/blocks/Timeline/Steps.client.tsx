'use client'

import React, { useEffect, useRef, useState } from 'react'

type Event = { id?: string | null; year: string; title: string; text: string }

/** Altura de la pantalla (0 a 1) donde se alinean el año y el hito activo en celular, donde no hay año fijo. */
const MOBILE_LINE = 0.4

/**
 * Hitos con el año fijo (sticky) a la derecha.
 * - Entrada: al aparecer la línea de tiempo, el año sube y el texto aparece con un fundido (una sola vez).
 * - El año fijo queda centrado en el área libre bajo el menú fijo (de --header-h al final de la pantalla).
 * - El hito activo es el que tiene su texto más cerca de la línea de lectura, que es ese mismo centro,
 *   así que título y año siempre quedan alineados.
 * - El año cambia con un fundido corto, sin pasar por los años intermedios.
 * - Debajo del año, una barra de progreso con un punto por hito y el contador «02 / 05».
 * En celular no hay columna fija: cada hito lleva su año arriba.
 */
export const TimelineSteps: React.FC<{ events: Event[] }> = ({ events }) => {
  const [active, setActive] = useState(0)
  const [entered, setEntered] = useState(false)
  // Avance continuo por la línea de tiempo: 0 en el primer hito, total-1 en el último
  const [progress, setProgress] = useState(0)
  const root = useRef<HTMLDivElement | null>(null)
  const blocks = useRef<(HTMLDivElement | null)[]>([])
  const sticky = useRef<HTMLDivElement | null>(null)

  // Entrada: se activa una vez, cuando la línea de tiempo empieza a verse
  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setEntered(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -20% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Hito activo según el scroll
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      // Centro del área libre bajo el menú: el `top` del año fijo (alto del menú) más la mitad del resto.
      // En celular el año no es fijo y su `top` es «auto»: se usa la línea de siempre.
      // El relleno de abajo del año fijo sube el centro para compensar la barra que cuelga debajo del año
      const style = sticky.current ? getComputedStyle(sticky.current) : null
      const top = style ? parseFloat(style.top) : NaN
      const bottom = style ? parseFloat(style.paddingBottom) || 0 : 0
      const line = Number.isNaN(top) ? window.innerHeight * MOBILE_LINE : top + (window.innerHeight - top - bottom) / 2
      const centers = blocks.current.map((el) => {
        if (!el) return 0
        const rect = el.getBoundingClientRect()
        return rect.top + rect.height / 2
      })
      const last = centers.length - 1
      if (last < 1) {
        setActive(0)
        setProgress(0)
        return
      }

      // Posición del scroll medida en hitos: 0 = primer hito en la línea de lectura,
      // 1 = segundo hito en la línea, 0.5 = a medio camino entre los dos (se extiende antes y después)
      const at = (i: number) => centers[Math.min(Math.max(i, 0), last)] ?? 0
      let raw: number
      if (line <= at(0)) raw = (line - at(0)) / (at(1) - at(0) || 1)
      else if (line >= at(last)) raw = last + (line - at(last)) / (at(last) - at(last - 1) || 1)
      else {
        let i = 0
        while (i < last - 1 && line > at(i + 1)) i++
        raw = i + (line - at(i)) / (at(i + 1) - at(i) || 1)
      }

      // Una sola regla para el año y para la barra: cada hito «empieza» a medio camino desde
      // el anterior. En ese mismo momento cambia el año y la barra llega al punto del hito;
      // mientras se lee el hito, la barra recorre su tramo hasta el punto siguiente.
      const bar = Math.min(Math.max(raw + 0.5, 0), last)
      setProgress(bar)
      setActive(Math.min(Math.floor(bar), last))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [events.length])

  const total = events.length
  const pad = (n: number) => String(n).padStart(2, '0')
  const enter =
    'transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ' +
    (entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 motion-reduce:translate-y-0')

  return (
    <div className="relative grid grid-cols-1 md:grid-cols-2 md:gap-10" ref={root}>
      {/* El primer y el último hito llegan a la línea de lectura con el año ya fijo: el centro del primer hito
          (relleno + 35svh) debe quedar en la mitad del área libre bajo el menú, (100svh − menú − 3rem) / 2,
          donde 3rem es el relleno de abajo del año fijo. Arriba se resta 1.5rem y abajo se suma, porque la columna
          fija termina 3rem por debajo del centro al llegar al final */}
      <ol className={'relative md:pb-[calc(15svh_-_var(--header-h)_/_2_+_1.5rem)] md:pt-[calc(15svh_-_var(--header-h)_/_2_-_1.5rem)] ' + enter} role="list" style={{ transitionDelay: '150ms' }}>
        {events.map((event, i) => {
          const isActive = i === active
          return (
            <li className="flex flex-col justify-center py-10 md:min-h-[70svh] md:py-0" key={event.id || i}>
              <div
                className={
                  'transition-opacity duration-500 ease-out motion-reduce:transition-none ' +
                  (isActive ? 'md:opacity-100' : 'md:opacity-[0.18]')
                }
                ref={(el) => {
                  blocks.current[i] = el
                }}
              >
                {/* Año solo en celular (44px: destaca sin pesar tanto como el año fijo de tablet y escritorio) */}
                <p className="font-[family-name:var(--font-display)] text-[2.75rem] font-semibold leading-none tracking-[-0.03em] text-ocre md:hidden">
                  {event.year}
                </p>
                <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold leading-tight md:mt-0 md:text-[clamp(1.75rem,1.2rem+1.8vw,3rem)] md:leading-[1.05]">
                  {event.title}
                </h3>
                <p className="mt-4 text-step-body leading-relaxed text-besh-suave/85 md:max-w-[44ch]">{event.text}</p>
              </div>
            </li>
          )
        })}
      </ol>

      {/* Año fijo a la altura de la línea de lectura, con la barra de progreso debajo (desde tablet) */}
      <div aria-hidden="true" className="hidden md:block">
        <div
          className="sticky top-[var(--header-h)] flex h-[calc(100svh-var(--header-h))] flex-col justify-center pb-12"
          ref={sticky}
        >
          {/* relative: la barra cuelga debajo del año sin mover su centro */}
          <div className={'relative ' + enter}>
            <div className="relative h-[1em] font-[family-name:var(--font-display)] text-[clamp(7rem,3rem+10vw,15rem)] font-semibold leading-none tracking-[-0.04em] text-ocre">
              {events.map((event, i) => {
                const isActive = i === active
                const offset = i < active ? '-0.2em' : i > active ? '0.2em' : '0'
                return (
                  <p
                    className="absolute inset-x-0 top-0 text-right transition-[opacity,transform] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                    key={event.id || i}
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: `translateY(${offset})`,
                      // El año que se va desaparece rápido; el nuevo entra un instante después,
                      // así nunca se ven dos años encimados
                      transitionDuration: isActive ? '600ms' : '220ms',
                      transitionDelay: isActive ? '120ms' : '0ms',
                    }}
                  >
                    {event.year}
                  </p>
                )
              })}
            </div>

            {/* Progreso: la línea ocre avanza con el scroll y va pasando por el punto de cada hito */}
            {total > 1 && (
              <div className="absolute right-0 top-full mt-8 flex w-full max-w-[26rem] items-center gap-5">
                <div className="relative h-3 flex-1">
                  <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-besh-suave/25" />
                  <span
                    className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-ocre"
                    style={{ width: `${(progress / (total - 1)) * 100}%` }}
                  />
                  {events.map((event, i) => (
                    <span
                      className={
                        'absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-[width,height,background-color] duration-300 motion-reduce:transition-none ' +
                        (i === active
                          ? 'size-3 bg-ocre'
                          : progress >= i - 0.01
                            ? 'size-1.5 bg-ocre'
                            : 'size-1.5 bg-besh-suave/40')
                      }
                      key={event.id || i}
                      style={{ left: `${(i / (total - 1)) * 100}%` }}
                    />
                  ))}
                </div>
                <p className="shrink-0 text-sm tabular-nums tracking-wide text-besh-suave/70">
                  <span className="text-besh-suave">{pad(active + 1)}</span> / {pad(total)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
