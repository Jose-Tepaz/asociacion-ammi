'use client'

import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import type { Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

export type GalleryItem = { caption?: string | null; image: MediaType; src: string }

const VISIBLE = 9

/** Mosaico de fotos con un visor a pantalla completa: flechas, teclado, contador y deslizar. */
export const PostGallery: React.FC<{ items: GalleryItem[] }> = ({ items }) => {
  const [index, setIndex] = useState<number | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const touchX = useRef<number | null>(null)
  const open = index !== null
  const total = items.length

  const go = useCallback(
    (dir: number) => setIndex((i) => (i === null ? i : (i + dir + total) % total)),
    [total],
  )

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

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, go])

  const shown = items.slice(0, VISIBLE)
  const hidden = total - shown.length
  const current = index !== null ? items[index] : null

  return (
    <section aria-label="Galería de fotos" className="mt-14">
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <h2 className="text-step-title">Galería</h2>
        <p className="text-step-small text-texto-secundario">
          {total} {total === 1 ? 'foto' : 'fotos'}
        </p>
      </div>

      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4" role="list">
        {shown.map((item, i) => {
          const isLast = i === shown.length - 1 && hidden > 0
          return (
            <li className={cn(i === 0 && 'col-span-2 row-span-2')} key={item.image.id}>
              <button
                aria-label={`Ver foto ${i + 1} de ${total}${item.caption ? `: ${item.caption}` : ''}`}
                className="group relative block aspect-square w-full cursor-zoom-in overflow-hidden rounded-card bg-besh-oscuro"
                onClick={() => setIndex(i)}
                type="button"
              >
                <Media
                  fill
                  imgClassName="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  resource={item.image}
                  size={i === 0 ? '(max-width: 768px) 100vw, 40vw' : '(max-width: 768px) 50vw, 20vw'}
                />
                <span className="absolute inset-0 grid place-items-center bg-corinto-secundario/0 text-besh-suave opacity-0 transition-all duration-300 group-hover:bg-corinto-secundario/45 group-hover:opacity-100">
                  <Expand aria-hidden="true" className="size-7" />
                </span>
                {isLast && (
                  <span className="absolute inset-0 grid place-items-center bg-corinto-secundario/70 font-[family-name:var(--font-display)] text-step-head text-besh-suave">
                    +{hidden}
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>

      <dialog
        aria-label="Visor de la galería"
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 text-besh-suave backdrop:bg-corinto-terciario/95"
        onCancel={(e) => {
          e.preventDefault()
          setIndex(null)
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setIndex(null)
        }}
        onClose={() => setIndex(null)}
        ref={dialog}
      >
        {current && (
          <div
            className="pointer-events-none flex h-full w-full flex-col items-center justify-center gap-4 px-4 pb-6 pt-20 md:px-24"
            onTouchEnd={(e) => {
              if (touchX.current === null) return
              const dx = e.changedTouches[0]!.clientX - touchX.current
              if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
              touchX.current = null
            }}
            onTouchStart={(e) => {
              touchX.current = e.touches[0]!.clientX
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={current.image.alt || current.caption || ''}
              className="lightbox-in pointer-events-auto max-h-[78dvh] max-w-full rounded-xl object-contain shadow-[0_30px_80px_-20px_rgb(0_0_0/0.6)]"
              key={current.image.id}
              src={current.src}
            />
            <p className="pointer-events-auto text-center text-step-small text-besh-fuerte">
              <span className="font-medium text-besh-suave">
                {index! + 1} de {total}
              </span>
              {current.caption && <span> · {current.caption}</span>}
            </p>
          </div>
        )}

        <button
          aria-label="Cerrar"
          autoFocus
          className="fixed right-4 top-4 grid size-12 place-items-center rounded-full bg-besh-suave text-corinto-terciario transition-colors hover:bg-ocre md:right-6 md:top-6"
          onClick={() => setIndex(null)}
          type="button"
        >
          <X aria-hidden="true" className="size-6" />
        </button>
        {total > 1 && (
          <>
            <button
              aria-label="Foto anterior"
              className="fixed left-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-besh-suave/15 transition-colors hover:bg-besh-suave hover:text-corinto-terciario md:left-6"
              onClick={() => go(-1)}
              type="button"
            >
              <ChevronLeft aria-hidden="true" className="size-6" />
            </button>
            <button
              aria-label="Foto siguiente"
              className="fixed right-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-besh-suave/15 transition-colors hover:bg-besh-suave hover:text-corinto-terciario md:right-6"
              onClick={() => go(1)}
              type="button"
            >
              <ChevronRight aria-hidden="true" className="size-6" />
            </button>
          </>
        )}
      </dialog>
    </section>
  )
}
