'use client'

import React, { useState } from 'react'

import type { WorkAreasBlock as WorkAreasBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

export const WorkAreasBlock: React.FC<WorkAreasBlockProps & { id?: string | null }> = ({
  heading,
  id,
  items,
}) => {
  const [active, setActive] = useState(0)
  const list = items || []
  const current = list[active]

  return (
    <section className="bg-besh-fuerte">
      <div className="grid lg:grid-cols-[38fr_62fr] lg:min-h-[100svh]">
        <div className="container lg:max-w-none flex flex-col py-16 lg:py-20">
          <h2 className="text-step-head max-w-[12ch]" data-reveal>
            {heading}
          </h2>

          <ul className="mt-12 lg:mt-auto flex flex-col" role="list">
            {list.map((item, i) => {
              const isActive = i === active
              const panelId = `linea-${id}-${i}`
              return (
                <li key={item.id || i}>
                  <button
                    aria-controls={panelId}
                    aria-expanded={isActive}
                    className={cn(
                      'group w-full flex items-baseline justify-between gap-6 py-3 text-left transition-colors',
                      isActive ? 'text-corinto' : 'text-foreground hover:text-corinto',
                    )}
                    onClick={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    type="button"
                  >
                    <span className="text-step-title font-medium">
                      {item.title}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        'shrink-0 h-3 w-3 transition-transform duration-300',
                        isActive ? 'bg-fucsia scale-100' : 'bg-besh-oscuro scale-75',
                      )}
                    />
                  </button>
                  <div
                    className={cn('grid transition-[grid-template-rows] duration-500', isActive ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}
                    id={panelId}
                  >
                    <p className="overflow-hidden text-step-body max-w-[46ch]">
                      <span className="block pb-5">{item.summary}</span>
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="relative min-h-[60svh] lg:min-h-0 overflow-hidden bg-corinto">
          {list.map((item, i) =>
            item.image && typeof item.image === 'object' ? (
              <div
                aria-hidden={i !== active}
                className={cn(
                  'absolute inset-0 transition-[clip-path] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
                  i === active ? '[clip-path:inset(0)]' : '[clip-path:inset(100%_0_0_0)]',
                )}
                key={item.id || i}
              >
                <Media fill imgClassName="object-cover" resource={item.image} size="(max-width: 1024px) 100vw, 62vw" />
              </div>
            ) : null,
          )}
          {current && !(current.image && typeof current.image === 'object') && (
            <p className="absolute inset-x-0 bottom-0 p-[var(--margin)] text-step-head text-besh-suave max-w-[14ch]">
              {current.title}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
