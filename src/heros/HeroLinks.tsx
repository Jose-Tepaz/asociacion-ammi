import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'

export const HeroLinks: React.FC<{ className?: string; links: Page['hero']['links'] }> = ({
  className,
  links,
}) => {
  if (!Array.isArray(links) || links.length === 0) return null

  return (
    <ul className={cn('flex flex-wrap items-center gap-x-6 gap-y-3', className)}>
      {links.map(({ link }, i) => (
        <li key={i}>
          <CMSLink size="lg" {...link} />
        </li>
      ))}
    </ul>
  )
}

/** Estilos del título enriquecido de las portadas: un H1 grande y un párrafo de apoyo. */
export const heroTitleClasses =
  '[&_h1]:text-step-display [&_h1]:m-0 [&_h2]:text-step-head [&_h2]:m-0 [&_p]:text-step-lead [&_p]:mt-8 [&_p]:max-w-[36ch] [&_p]:text-foreground'
