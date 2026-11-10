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

import { StepsProgress } from './StepsProgress.client'

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
 * a la derecha cada espacio de la Alianza en un recorrido vertical: la línea se rellena al bajar
 * y cada espacio se enciende al llegar a la mitad de la pantalla (ver StepsProgress).
 */
export const StructureBlock: React.FC<StructureBlockProps> = ({ heading, image, intro, items, kicker }) => {
  const list = items || []
  const hasImage = image && typeof image === 'object'

  return (
    <section className="container section-pad">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-10 lg:gap-16">
        {/* Encabezado y foto: en escritorio se quedan fijos mientras se recorre la lista */}
        <div className="md:col-span-5">
          {/* top: deja libre el menú fijo (--header-h) más 2rem de aire, para que no tape la etiqueta */}
          <div className="md:sticky md:top-[calc(var(--header-h)+2rem)]">
            <div data-reveal>
              {kicker && <p className="kicker mb-3 uppercase tracking-[0.18em] md:mb-4">{kicker}</p>}
              <h2 className="text-step-head text-corinto md:max-w-[14ch]">{heading}</h2>
              {intro && <p className="mt-4 text-step-body text-texto-secundario md:mt-5 md:max-w-[46ch]">{intro}</p>}
            </div>
            <figure
              className="group relative mt-8 aspect-[16/10] overflow-hidden rounded-card bg-besh-fuerte md:mt-10 md:aspect-auto md:h-[calc(100svh-26rem-var(--header-h))] md:min-h-[16rem] lg:h-[calc(100svh-24rem-var(--header-h))] lg:min-h-[18rem]"
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

        {/* Espacios de la Alianza: recorrido con una línea que se rellena al bajar */}
        {list.length > 0 && (
          <div className="md:col-span-7">
            <StepsProgress>
              {/* Línea base y relleno; su alto y posición los ajusta StepsProgress */}
              <span aria-hidden="true" className="absolute left-6 w-0.5 -translate-x-1/2 bg-besh-oscuro" data-track>
                <span className="absolute inset-x-0 top-0 h-0 bg-corinto" data-fill />
              </span>
              <ol className="relative" role="list">
                {list.map((item, i) => {
                  const Icon = icons[item.icon] || UsersRound
                  return (
                    <li className="group flex gap-6 pb-20 last:pb-0 md:gap-8 md:pb-28 lg:pb-36" data-step key={item.id || i}>
                      <span
                        className="relative z-10 grid size-12 shrink-0 place-items-center rounded-full border-2 border-besh-oscuro bg-background text-texto-secundario/70 transition-all duration-500 group-data-[active]:border-corinto group-data-[active]:bg-corinto group-data-[active]:text-besh-suave group-data-[active]:shadow-[0_0_0_8px_rgb(123_30_58/0.12)]"
                        data-icon
                      >
                        <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
                      </span>
                      <div className="pt-1.5 opacity-40 transition-opacity duration-500 group-data-[active]:opacity-100">
                        <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold leading-tight text-corinto md:text-2xl">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-step-body leading-relaxed text-texto-secundario">
                          {item.description}
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </StepsProgress>
          </div>
        )}
      </div>
    </section>
  )
}
