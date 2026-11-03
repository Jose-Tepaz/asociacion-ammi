'use client'

import { ArrowUpRight, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

/**
 * La pieza de una publicación con su visor: al tocar la imagen o «Ver en grande»
 * se abre a pantalla completa en la misma página, y se cierra con la ×, Esc o tocando fuera.
 */
export const Lightbox: React.FC<{
  alt: string
  children: React.ReactNode
  src: string
}> = ({ alt, children, src }) => {
  const [open, setOpen] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = dialog.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
    document.documentElement.style.overflow = open ? 'hidden' : ''
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <button
        aria-label="Ver la pieza en tamaño completo"
        className="group block w-full cursor-zoom-in overflow-hidden rounded-xl text-left"
        onClick={() => setOpen(true)}
        type="button"
      >
        {children}
      </button>
      <div className="flex items-center justify-between gap-3 px-2 pt-3 text-step-small text-texto-secundario">
        <span className="line-clamp-1">{alt}</span>
        <button
          className="inline-flex shrink-0 items-center gap-1 font-medium text-corinto underline-offset-4 hover:underline"
          onClick={() => setOpen(true)}
          type="button"
        >
          Ver en grande
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </button>
      </div>

      <dialog
        aria-label={alt}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-corinto-terciario/90 backdrop:backdrop-blur-sm"
        onClick={(e) => {
          // Un clic en el fondo (fuera de la imagen) cierra el visor
          if (e.target === e.currentTarget) setOpen(false)
        }}
        onCancel={(e) => {
          // Esc: se cierra por el mismo camino que la ×, para liberar el desplazamiento
          e.preventDefault()
          setOpen(false)
        }}
        onClose={() => setOpen(false)}
        ref={dialog}
      >
        {open && (
          <div className="lightbox-in pointer-events-none flex h-full w-full items-center justify-center p-4 md:p-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={alt}
              className="pointer-events-auto max-h-full max-w-full rounded-xl object-contain shadow-[0_30px_80px_-20px_rgb(0_0_0/0.6)]"
              src={src}
            />
          </div>
        )}
        <button
          aria-label="Cerrar"
          autoFocus
          className="fixed right-4 top-4 grid size-12 place-items-center rounded-full bg-besh-suave text-corinto-terciario shadow-lg transition-colors hover:bg-ocre md:right-6 md:top-6"
          onClick={() => setOpen(false)}
          type="button"
        >
          <X aria-hidden="true" className="size-6" />
        </button>
      </dialog>
    </>
  )
}
