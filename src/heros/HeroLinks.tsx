import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'

export const HeroLinks: React.FC<{
  className?: string
  links: Page['hero']['links']
  /** Sobre fondo corinto los botones invierten sus colores */
  onDark?: boolean
}> = ({ className, links, onDark }) => {
  if (!Array.isArray(links) || links.length === 0) return null

  return (
    <ul className={cn('flex flex-wrap items-center gap-3', className)}>
      {links.map(({ link }, i) => (
        <li key={i}>
          <CMSLink
            className={cn(
              onDark &&
                (link.appearance === 'outline'
                  ? 'border-besh-suave bg-besh-suave text-corinto-secundario hover:bg-ocre hover:border-ocre hover:text-texto-primario'
                  : 'bg-fucsia text-besh-suave hover:bg-besh-suave hover:text-corinto-secundario'),
            )}
            size="lg"
            {...link}
          />
        </li>
      ))}
    </ul>
  )
}

/** Estilos del título enriquecido de las portadas: un H1 grande y un párrafo de apoyo. */
export const heroTitleClasses =
  '[&_h1]:text-step-display [&_h1]:m-0 [&_h2]:text-step-head [&_h2]:m-0 [&_p]:text-step-lead [&_p]:mt-4 md:[&_p]:mt-6 lg:[&_p]:mt-4 [&_p]:max-w-[40ch]'
