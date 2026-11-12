import React from 'react'
import { FaInstagram } from 'react-icons/fa6'

import type { SocialGalleryBlock as SocialGalleryBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'

import { SocialCarousel } from './Carousel'

/** Las últimas piezas de las redes: título a la izquierda y carrusel a la derecha. */
export const SocialGalleryBlock: React.FC<SocialGalleryBlockProps> = ({
  description,
  handle,
  heading,
  posts,
  profileUrl,
}) => {
  const list = (posts || []).filter((p) => p.image && typeof p.image === 'object')
  const profileLabel = handle || (profileUrl ? 'Seguir en Instagram' : null)

  const header = (
    <div>
      <h2 className="text-step-head">{heading}</h2>
      {description && <p className="mt-4 text-step-lead text-texto-secundario max-w-[32ch]">{description}</p>}
      {profileLabel &&
        (profileUrl ? (
          <a
            className="mt-6 md:mt-4 lg:mt-8 inline-flex items-center gap-2 text-step-body font-medium text-fucsia underline decoration-fucsia/40 decoration-2 underline-offset-4 transition-colors hover:decoration-fucsia"
            href={profileUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            <FaInstagram aria-hidden="true" className="size-5" />
            {profileLabel}
          </a>
        ) : (
          <p className="mt-4 text-step-body font-medium text-fucsia">{profileLabel}</p>
        ))}
    </div>
  )

  return (
    <section className="overflow-hidden bg-besh-fuerte py-[var(--section-y)]">
      <SocialCarousel header={header}>
        {list.map((post, i) => {
          const href = post.url || profileUrl
          const tile = (
            <span className="relative block aspect-square overflow-hidden rounded-card bg-besh-oscuro">
              <Media
                fill
                imgClassName="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                resource={post.image}
                size="(max-width: 768px) 80vw, 24rem"
              />
              <span className="absolute inset-0 grid place-items-center bg-corinto-secundario/0 text-besh-suave opacity-0 transition-all duration-300 group-hover:bg-corinto-secundario/55 group-hover:opacity-100 group-focus-within:bg-corinto-secundario/55 group-focus-within:opacity-100">
                <FaInstagram aria-hidden="true" className="size-10" />
              </span>
              {/* En pantallas táctiles no hay hover: una etiqueta fija avisa que es un enlace a Instagram */}
              {href && (
                <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-step-small font-medium text-corinto shadow-[0_6px_16px_-8px_rgb(36_15_22/0.45)] [@media(hover:hover)]:hidden">
                  <FaInstagram aria-hidden="true" className="size-4" />
                  Ver en Instagram
                </span>
              )}
            </span>
          )
          return (
            <li className="group w-[80%] shrink-0 snap-start sm:w-[22rem] xl:w-[24rem]" key={post.id || i}>
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
      </SocialCarousel>
    </section>
  )
}
