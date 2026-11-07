import {
  BookOpen,
  Flag,
  Handshake,
  Laptop,
  type LucideIcon,
  Megaphone,
  Network,
  Scale,
  Sprout,
  UserRound,
  UsersRound,
} from 'lucide-react'
import React from 'react'

import type { StructureBlock as StructureBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'

const icons: Record<string, LucideIcon> = {
  book: BookOpen,
  flag: Flag,
  handshake: Handshake,
  laptop: Laptop,
  megaphone: Megaphone,
  network: Network,
  scale: Scale,
  sprout: Sprout,
  user: UserRound,
  users: UsersRound,
}

/**
 * Cómo nos organizamos: a la izquierda (fija en escritorio) la etiqueta, el título, el texto y una foto;
 * a la derecha cada espacio de la Alianza en una lista vertical unida por una línea,
 * como un recorrido de la Asamblea hasta las mujeres que participan a título individual.
 */
export const StructureBlock: React.FC<StructureBlockProps> = ({ heading, image, intro, items, kicker }) => {
  const list = items || []
  const hasImage = image && typeof image === 'object'

  return (
    <section className="container section-pad">
      <div className="grid grid-cols-1 gap-10 md:gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Encabezado y foto: en escritorio se quedan fijos mientras se recorre la lista */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <div data-reveal>
              {kicker && <p className="kicker mb-3 uppercase tracking-[0.18em] md:mb-4">{kicker}</p>}
              <h2 className="text-step-head max-w-[14ch] text-corinto">{heading}</h2>
              {intro && <p className="mt-4 max-w-[46ch] text-step-body text-texto-secundario md:mt-5">{intro}</p>}
            </div>
            <figure
              className="group relative mt-8 aspect-[16/10] overflow-hidden rounded-card bg-besh-fuerte md:mt-10 lg:aspect-[4/5]"
              data-reveal
              style={{ '--i': 1 } as React.CSSProperties}
            >
              {hasImage ? (
                <Media
                  fill
                  imgClassName="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  resource={image}
                  size="(max-width: 1024px) 100vw, 40vw"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt="" className="absolute inset-0 m-auto w-1/2" src="/brand/ammi-mark-ink.png" />
              )}
              <span aria-hidden="true" className="tejido absolute inset-x-0 bottom-0" />
            </figure>
          </div>
        </div>

        {/* Espacios de la Alianza */}
        {list.length > 0 && (
          <ol className="relative lg:col-span-7" role="list">
            {/* Línea que une los íconos */}
            <span
              aria-hidden="true"
              className="absolute bottom-10 left-6 top-10 w-px -translate-x-1/2 bg-besh-oscuro md:left-7"
            />
            {list.map((item, i) => {
              const Icon = icons[item.icon] || UsersRound
              return (
                <li
                  className="relative flex gap-5 border-b border-besh-oscuro/70 py-6 last:border-b-0 md:gap-7 md:py-8"
                  data-reveal
                  key={item.id || i}
                  style={{ '--i': Math.min(i, 3) } as React.CSSProperties}
                >
                  <span className="relative z-10 grid size-12 shrink-0 place-items-center rounded-2xl bg-corinto text-besh-suave md:size-14">
                    <Icon aria-hidden="true" className="size-5 md:size-6" strokeWidth={1.75} />
                  </span>
                  <div className="pt-1 md:pt-2">
                    <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold leading-tight text-corinto md:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-[52ch] text-step-body leading-relaxed text-texto-secundario">
                      {item.description}
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>
        )}
      </div>
    </section>
  )
}
