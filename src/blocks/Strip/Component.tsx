import React from 'react'

import type { StripBlock as StripBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

// Anchos deliberadamente desiguales: la franja se lee como una sola vista plegada
const grow = ['md:grow-[5]', 'md:grow-[2]', 'md:grow-[3]', 'md:grow-[2]']
const phone = ['basis-[64%]', 'basis-[36%]', 'basis-[36%]', 'basis-[64%]']

export const StripBlock: React.FC<StripBlockProps> = ({ caption, heading, images, panelTitle }) => {
  const list = (images || []).filter((row) => row?.image && typeof row.image === 'object')

  return (
    <section>
      <h2 className="container text-step-title mb-10 md:mb-16 lg:ps-[calc(var(--margin)+16.6%)]" data-reveal>
        {heading}
      </h2>
      <div className="flex flex-wrap md:flex-nowrap h-[84svh] md:h-[68svh]" data-reveal style={{ '--i': 1 } as React.CSSProperties}>
        {list.map((row, i) => (
          <div
            className={cn(
              'group relative overflow-hidden h-1/2 md:h-full md:basis-0 transition-[flex-grow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hover:grow-[6]',
              phone[i],
              grow[i],
            )}
            key={row.id || i}
          >
            <Media
              fill
              imgClassName="object-cover grayscale contrast-[1.05] transition-transform duration-700 group-hover:scale-[1.03]"
              resource={row.image}
              size="(max-width: 768px) 64vw, 40vw"
            />
            {i === 0 && panelTitle && (
              <p className="absolute left-0 top-0 max-w-[18ch] bg-corinto-terciario/85 p-5 md:p-6 text-step-lead text-besh-suave">
                {panelTitle}
              </p>
            )}
          </div>
        ))}
      </div>
      {caption && <p className="container mt-4 text-step-body text-muted-foreground">{caption}</p>}
    </section>
  )
}
