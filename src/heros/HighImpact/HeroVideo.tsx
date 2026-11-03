'use client'

import { Pause, Play } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

/**
 * Video de fondo de la portada: sin sonido, en bucle y con botón para pausarlo.
 * Si la persona pidió reducir el movimiento, empieza en pausa.
 */
export const HeroVideo: React.FC<{ src: string; type?: string | null }> = ({ src, type }) => {
  const video = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const el = video.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    el.play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false))
  }, [])

  const toggle = () => {
    const el = video.current
    if (!el) return
    if (el.paused) {
      el.play().then(() => setPlaying(true)).catch(() => {})
    } else {
      el.pause()
      setPlaying(false)
    }
  }

  return (
    <>
      <video
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        loop
        muted
        playsInline
        preload="metadata"
        ref={video}
      >
        <source src={src} type={type || undefined} />
      </video>
      <button
        aria-label={playing ? 'Pausar el video' : 'Reproducir el video'}
        className="absolute bottom-6 right-[var(--margin)] z-20 grid size-11 place-items-center rounded-full bg-besh-suave/15 text-besh-suave backdrop-blur-sm transition-colors hover:bg-besh-suave hover:text-corinto-secundario md:bottom-auto md:top-6"
        onClick={toggle}
        type="button"
      >
        {playing ? <Pause aria-hidden="true" className="size-5" /> : <Play aria-hidden="true" className="size-5" />}
      </button>
    </>
  )
}
