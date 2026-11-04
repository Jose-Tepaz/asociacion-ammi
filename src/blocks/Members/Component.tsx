import React from 'react'

import type { MembersBlock as MembersBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

type Org = NonNullable<MembersBlockProps['organizations']>[number]

/** Agrupa las organizaciones por categoría, respetando el orden en que aparece cada una. */
const groupByCategory = (list: Org[]) => {
  const groups: { label: string; items: Org[] }[] = []
  for (const org of list) {
    const label = org.category?.trim() || ''
    let group = groups.find((g) => g.label === label)
    if (!group) {
      group = { label, items: [] }
      groups.push(group)
    }
    group.items.push(org)
  }
  return groups
}

/** Siglas para cuando no hay logo: las indicadas, o lo que va después de la última coma, o el nombre. */
const shortName = (org: Org) => {
  if (org.acronym?.trim()) return org.acronym.trim()
  const parts = org.name.split(',')
  return parts.length > 1 ? parts[parts.length - 1].trim() : org.name
}

/**
 * Logo dentro de una caja de tamaño fijo: cualquier imagen (cuadrada, redonda, horizontal,
 * grande o pequeña) se ajusta sin deformarse ni salirse.
 */
const OrgCell: React.FC<{ org: Org }> = ({ org }) => {
  const hasLogo = org.logo && typeof org.logo === 'object'
  const label = shortName(org)
  const Wrapper: React.ElementType = org.url ? 'a' : 'div'

  return (
    <li>
      <Wrapper
        {...(org.url ? { href: org.url, rel: 'noopener noreferrer', target: '_blank' } : {})}
        className="group flex h-full flex-col gap-3"
        title={org.focus ? `${org.name} · ${org.focus}` : org.name}
      >
        <span className="relative flex h-20 w-full max-w-[12rem] items-center md:h-24 lg:h-28">
          {hasLogo ? (
            <Media
              fill
              imgClassName="object-contain object-left transition-transform duration-300 group-hover:scale-[1.04]"
              resource={org.logo}
              size="(max-width: 768px) 40vw, 12rem"
            />
          ) : (
            <span
              aria-hidden="true"
              className="font-[family-name:var(--font-display)] text-xl font-semibold leading-none tracking-tight text-texto-primario/60 transition-colors duration-300 group-hover:text-corinto md:text-2xl"
            >
              {label}
            </span>
          )}
        </span>
        <span className="line-clamp-2 max-w-[26ch] text-xs leading-snug text-texto-secundario">{org.name}</span>
      </Wrapper>
    </li>
  )
}

/** Organizaciones: logos (o siglas) agrupados por categoría. */
export const MembersBlock: React.FC<MembersBlockProps> = ({ heading, headingSecond, intro, organizations }) => {
  const list = organizations || []
  const groups = groupByCategory(list)
  const hasCategories = groups.some((g) => g.label)

  return (
    <section className="container section-pad">
      <div className="grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-x-8">
        <h2 className="text-step-head text-corinto lg:col-span-7" data-reveal>
          <span className="block">{heading}</span>
          {headingSecond && <span className="block lg:ps-[16.6%]">{headingSecond}</span>}
        </h2>
        {intro && (
          <p
            className="text-step-body max-w-[46ch] text-texto-secundario lg:col-span-4 lg:col-start-9"
            data-reveal
            style={{ '--i': 1 } as React.CSSProperties}
          >
            {intro}
          </p>
        )}
      </div>

      {list.length > 0 && (
        <div className="mt-10 space-y-10 md:mt-12 md:space-y-12 lg:mt-16 lg:space-y-14">
          {groups.map((group, gi) => (
            <div
              className={cn('grid gap-5', hasCategories && 'lg:grid-cols-12 lg:gap-12')}
              data-reveal
              key={group.label || gi}
              style={{ '--i': gi + 2 } as React.CSSProperties}
            >
              {hasCategories && (
                <div className="lg:col-span-3">
                  <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold leading-tight text-corinto md:text-2xl">
                    {group.label || 'Otras organizaciones'}
                  </h3>
                </div>
              )}
              <ul
                aria-label={group.label || 'Organizaciones'}
                className={cn(
                  'grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 md:gap-x-8',
                  hasCategories && 'lg:col-span-9',
                )}
                role="list"
              >
                {group.items.map((org, i) => (
                  <OrgCell key={org.id || i} org={org} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
