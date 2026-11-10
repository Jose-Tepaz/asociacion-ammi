import React from 'react'

import type { MembersBlock as MembersBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'

type Org = NonNullable<MembersBlockProps['organizations']>[number]

/** Nombre corto para cuando no hay logo: lo que va después de la última coma, o el nombre completo. */
const shortName = (org: Org) => {
  const parts = org.name.split(',')
  return parts.length > 1 ? parts[parts.length - 1].trim() : org.name
}

/**
 * Logo a una altura fija y con el ancho de su propia proporción: así el espacio entre
 * logos es el mismo para los redondos y los horizontales. Los muy anchos tienen un tope.
 */
const OrgCell: React.FC<{ org: Org }> = ({ org }) => {
  const hasLogo = org.logo && typeof org.logo === 'object'
  const label = shortName(org)
  const logo = hasLogo && typeof org.logo === 'object' ? org.logo : null
  const ratio = logo?.width && logo?.height ? logo.width / logo.height : 1

  return (
    <li className="shrink-0">
      <div
        className="marquee-logo relative flex h-[74px] max-w-[11rem] items-center justify-center [-webkit-tap-highlight-color:transparent] md:h-[90px] md:max-w-[13.5rem]"
        draggable={false}
        style={{ aspectRatio: hasLogo ? ratio : undefined }}
        title={org.name}
      >
        <span className="relative flex size-full items-center justify-center">
          {hasLogo ? (
            <Media
              fill
              imgClassName="pointer-events-none object-contain"
              resource={org.logo}
              size="(max-width: 768px) 11rem, 13.5rem"
            />
          ) : (
            <span
              aria-hidden="true"
              className="font-[family-name:var(--font-display)] text-xl font-semibold leading-none tracking-tight text-texto-primario/60 md:text-2xl"
            >
              {label}
            </span>
          )}
        </span>
        <span className="sr-only">{org.name}</span>
      </div>
    </li>
  )
}

/** Organizaciones: etiqueta, título corto y carrusel de logos en gris que se desliza hacia la derecha sin fin. */
export const MembersBlock: React.FC<MembersBlockProps> = ({ heading, headingSecond, intro, kicker, organizations }) => {
  const list = organizations || []
  const title = [heading, headingSecond].filter(Boolean).join(' ')
  // Unos 3 segundos por logo: la velocidad se siente igual con pocas o muchas organizaciones
  const duration = `${Math.max(list.length * 3000, 20000)}ms`

  return (
    <section className="section-pad">
      <div className="container grid gap-4 md:gap-5 max-lg:text-center lg:grid-cols-12 lg:items-end lg:gap-x-8">
        {/* El ancho máximo hace que el título caiga en dos líneas sin tener que separarlo a mano */}
        <div className="lg:col-span-8" data-reveal>
          {kicker && (
            <p className="kicker mb-3 uppercase tracking-[0.18em] md:mb-4">
              {kicker}
            </p>
          )}
          <h2 className="max-w-[18ch] text-step-head text-corinto max-lg:mx-auto">{title}</h2>
        </div>
        {intro && (
          <p
            className="text-step-body max-w-[46ch] text-texto-secundario max-lg:mx-auto max-lg:max-w-[64ch] lg:col-span-4"
            data-reveal
            style={{ '--i': 1 } as React.CSSProperties}
          >
            {intro}
          </p>
        )}
      </div>

      {list.length > 0 && (
        <div
          className="marquee mx-auto mt-10 max-w-[90rem] overflow-hidden md:mt-12 lg:mt-16"
          data-reveal
          style={{ '--i': 2 } as React.CSSProperties}
        >
          <div
            className="marquee-track flex w-max select-none"
            style={{ '--marquee-duration': duration } as React.CSSProperties}
          >
            {[false, true].map((copy) => (
              <ul
                aria-hidden={copy || undefined}
                aria-label={copy ? undefined : 'Organizaciones'}
                className="flex shrink-0 items-center gap-x-12 pe-12 md:gap-x-16 md:pe-16"
                key={String(copy)}
                role="list"
              >
                {list.map((org, i) => (
                  <OrgCell key={`${copy}-${org.id || i}`} org={org} />
                ))}
              </ul>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
