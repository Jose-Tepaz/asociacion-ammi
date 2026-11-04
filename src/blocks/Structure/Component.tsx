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
import { Connectors } from './Connectors.client'
import { cn } from '@/utilities/ui'

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

type Item = NonNullable<StructureBlockProps['items']>[number]

const IconTile: React.FC<{ Icon: LucideIcon; className?: string }> = ({ Icon, className }) => (
  <span
    aria-hidden="true"
    className={cn('shrink-0 place-items-center rounded-xl bg-fucsia/10 text-corinto', className)}
  >
    <Icon className="size-5 md:size-[1.375rem]" strokeWidth={1.75} />
  </span>
)

/**
 * Tarjeta de un espacio.
 * - Celular: ícono a la izquierda y texto a la derecha.
 * - Tablet y escritorio: ícono junto al título y descripción debajo, centrado en la tarjeta.
 */
const Card: React.FC<{ item: Item; index: number; side: 'left' | 'right' }> = ({ index, item, side }) => {
  const Icon = icons[item.icon] || UsersRound

  return (
    <li className="relative" data-reveal style={{ '--i': index + 1 } as React.CSSProperties}>
      <div className="flex h-full gap-4 rounded-card border border-besh-oscuro bg-white p-5 md:flex-col md:justify-center md:gap-0 md:p-7">
        <IconTile className="grid size-12 md:hidden" Icon={Icon} />
        <div>
          <h3 className="flex items-center gap-3 font-[family-name:var(--font-display)] text-xl font-semibold leading-tight text-corinto md:text-[1.375rem] xl:text-2xl">
            <IconTile className="hidden size-11 md:grid" Icon={Icon} />
            <span>{item.title}</span>
          </h3>
          <p className="mt-1.5 text-step-small leading-relaxed text-texto-secundario md:mt-3 md:text-base xl:text-[1.0625rem]">
            {item.description}
          </p>
        </div>
      </div>

      {/* Punto (invisible) de donde sale la línea hacia el círculo; la dibuja Connectors en escritorio */}
      <span
        aria-hidden="true"
        className={cn('pointer-events-none absolute top-1/2 hidden size-0 lg:block', side === 'left' ? 'right-0' : 'left-0')}
        data-dot
      />
    </li>
  )
}

/** Imagen circular con anillo punteado. `ring` marca el anillo al que llegan las líneas. */
const Circle: React.FC<{ image: StructureBlockProps['image']; ring?: boolean; className?: string }> = ({
  className,
  image,
  ring,
}) => {
  const hasImage = image && typeof image === 'object'
  return (
    <figure className={cn('group relative', className)} data-reveal>
      <span
        aria-hidden="true"
        className="absolute -inset-2 rounded-full border-2 border-dashed border-ocre/60 md:-inset-3"
        {...(ring ? { 'data-ring': true } : {})}
      />
      <div className="relative aspect-square overflow-hidden rounded-full bg-besh-fuerte">
        {hasImage ? (
          <Media
            fill
            imgClassName="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            resource={image} size="(max-width: 1024px) 14rem, 22rem" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img alt="" className="absolute inset-0 m-auto w-1/2" src="/brand/ammi-mark-ink.png" />
        )}
      </div>
    </figure>
  )
}

/**
 * Cómo nos organizamos: espacios de la Alianza alrededor de una imagen circular.
 * - Celular y tablet: título y círculo lado a lado; tarjetas debajo (1 y 2 columnas).
 * - Escritorio: tarjetas a los lados del círculo, unidas con líneas.
 */
export const StructureBlock: React.FC<StructureBlockProps> = ({ heading, image, intro, items, kicker }) => {
  const list = items || []
  const half = Math.ceil(list.length / 2)
  const left = list.slice(0, half)
  const right = list.slice(half)

  return (
    <section className="container section-pad">
      <header className="grid grid-cols-[1fr_auto] items-center gap-x-5 gap-y-5 md:gap-x-12 lg:grid-cols-12 lg:items-end lg:gap-10">
        <div className="col-start-1 row-start-1 lg:col-span-6" data-reveal>
          {kicker && (
            <p className="kicker mb-3 flex items-center gap-3 uppercase tracking-[0.18em] md:mb-4">
              {kicker}
              <span aria-hidden="true" className="h-px w-10 bg-fucsia/50" />
            </p>
          )}
          <h2 className="text-step-head max-w-[14ch] text-corinto max-md:text-[1.75rem] max-md:leading-[1.05]">
            {heading}
          </h2>
        </div>
        {intro && (
          <p
            className="col-span-2 row-start-2 text-step-body max-w-[46ch] text-texto-secundario md:col-span-1 md:col-start-1 md:self-start lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:self-end lg:border-s lg:border-besh-oscuro lg:ps-8"
            data-reveal
            style={{ '--i': 1 } as React.CSSProperties}
          >
            {intro}
          </p>
        )}
        {/* Celular y tablet: el círculo acompaña al título */}
        <Circle
          className="col-start-2 row-start-1 w-24 sm:w-32 md:row-span-2 md:w-52 lg:hidden"
          image={image}
        />
      </header>

      <Connectors className="mt-8 grid gap-4 md:mt-12 md:grid-cols-2 md:grid-rows-[repeat(3,1fr)] md:gap-5 lg:mt-14 lg:grid-cols-[1fr_clamp(12rem,22vw,18rem)_1fr] lg:gap-x-10 2xl:gap-x-16">
        <Circle
          className="hidden lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:block lg:w-full lg:self-center"
          image={image}
          ring
        />

        {/* Cada columna comparte las filas del contenedor (subgrid): todas las tarjetas miden igual */}
        <ul className="grid gap-4 md:col-start-1 md:row-span-3 md:row-start-1 md:grid-rows-subgrid md:gap-5" role="list">
          {left.map((item, i) => (
            <Card index={i} item={item} key={item.id || i} side="left" />
          ))}
        </ul>

        <ul
          className="grid gap-4 md:col-start-2 md:row-span-3 md:row-start-1 md:grid-rows-subgrid md:gap-5 lg:col-start-3"
          role="list"
        >
          {right.map((item, i) => (
            <Card index={half + i} item={item} key={item.id || half + i} side="right" />
          ))}
        </ul>
      </Connectors>
    </section>
  )
}
