import { Instagram } from 'lucide-react'
import React from 'react'

import type { SocialGalleryBlock as SocialGalleryBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'

const MAX_TILES = 4

/** Las últimas piezas de las redes: encabezado centrado, cuatro cuadros y el botón para seguir. */
export const SocialGalleryBlock: React.FC<SocialGalleryBlockProps> = ({
  description,
  handle,
  heading,
  posts,
  profileUrl,
}) => {
  const list = (posts || []).filter((p) => p.image && typeof p.image === 'object').slice(0, MAX_TILES)

  const handleNode =
    handle &&
    (profileUrl ? (
      <a
        className="font-medium text-fucsia underline decoration-fucsia/40 decoration-2 underline-offset-4 transition-colors hover:decoration-fucsia"
        href={profileUrl}
        rel="noopener noreferrer"
        target="_blank"
      >
        {handle}
      </a>
    ) : (
      <span className="font-medium text-fucsia">{handle}</span>
    ))

  return (
    <section className="bg-besh-fuerte py-[var(--section-y)]">
      <div className="container">
        <div className="mx-auto flex max-w-[44rem] flex-col items-center text-center" data-reveal>
          <p className="inline-flex items-center gap-2 rounded-full bg-corinto/10 px-4 py-1.5 text-step-small font-medium text-fucsia">
            <Instagram aria-hidden="true" className="size-4" />
            Instagram
          </p>
          <h2 className="mt-5 text-step-head">{heading}</h2>
          {(description || handle) && (
            <p className="mt-4 text-step-lead text-texto-secundario">
              {description}
              {description && handle && ' en '}
              {handleNode}
            </p>
          )}
        </div>

        <ul
          className="mt-12 grid grid-cols-2 gap-3 md:mt-16 md:gap-5 lg:grid-cols-4"
          data-reveal
          role="list"
          style={{ '--i': 1 } as React.CSSProperties}
        >
          {list.map((post, i) => {
            const tile = (
              <span className="relative block aspect-square overflow-hidden rounded-card bg-besh-oscuro">
                <Media
                  fill
                  imgClassName="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  resource={post.image}
                  size="(max-width: 1024px) 50vw, 25vw"
                />
                <span className="absolute inset-0 grid place-items-center bg-corinto-secundario/0 text-besh-suave opacity-0 transition-all duration-300 group-hover:bg-corinto-secundario/55 group-hover:opacity-100 group-focus-within:bg-corinto-secundario/55 group-focus-within:opacity-100">
                  <Instagram aria-hidden="true" className="size-9" />
                </span>
              </span>
            )
            const href = post.url || profileUrl
            return (
              <li className="group" key={post.id || i}>
                {href ? (
                  <a
                    aria-label={`Ver publicación ${i + 1} en Instagram`}
                    className="block rounded-card"
                    href={href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {tile}
                  </a>
                ) : (
                  tile
                )}
              </li>
            )
          })}
        </ul>

        {profileUrl && (
          <div className="mt-12 flex justify-center" data-reveal style={{ '--i': 2 } as React.CSSProperties}>
            <a
              className="inline-flex h-12 items-center gap-2 rounded-full bg-corinto px-7 text-step-small font-medium text-besh-suave transition-colors hover:bg-corinto-terciario"
              href={profileUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Instagram aria-hidden="true" className="size-4" />
              Seguir en Instagram
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
