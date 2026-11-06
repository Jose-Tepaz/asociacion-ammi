import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import type { WorkAreasBlock as WorkAreasBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

// Cada eje toma un color de la marca según su posición en el mosaico
const tones = [
  'bg-corinto text-besh-suave',
  'bg-corinto-secundario text-besh-suave',
  'bg-besh-oscuro text-corinto-terciario',
  'bg-ocre text-texto-primario',
  'bg-fucsia text-besh-suave',
  'bg-corinto-terciario text-besh-suave',
]
const layout = [
  'md:row-span-2',
  '',
  '',
  'md:col-span-2',
  '',
  'md:col-span-2',
]

type Item = NonNullable<WorkAreasBlockProps['items']>[number]

const Number_: React.FC<{ n: number }> = ({ n }) => (
  <span
    aria-hidden="true"
    className="absolute right-0 top-0 grid size-20 md:size-24 place-items-start justify-end rounded-bl-full bg-current/10 pe-5 pt-4 font-[family-name:var(--font-display)] text-step-title"
  >
    {String(n).padStart(2, '0')}
  </span>
)

const CardBody: React.FC<{ item: Item }> = ({ item }) => (
  <>
    <h3 className="text-step-title max-w-[22ch] pe-14">{item.title}</h3>
    <p className="mt-3 text-step-body opacity-90 max-w-[48ch]">{item.summary}</p>
    {item.url && (
      <span className="mt-6 inline-flex items-center gap-2 text-step-small font-medium">
        {item.linkLabel || 'Conocer más'}
        <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
      </span>
    )}
  </>
)

export const WorkAreasBlock: React.FC<WorkAreasBlockProps> = ({ allLink, heading, items, subheading }) => {
  const list = items || []

  return (
    <section className="bg-besh-fuerte/60 py-[var(--section-y)]">
      <div className="container">
        <div className="flex flex-col items-center gap-6 text-center" data-reveal>
          <div>
            <h2 className="text-step-head">{heading}</h2>
            {subheading && (
              <p className="mx-auto mt-3 text-step-body text-muted-foreground max-w-[62ch]">{subheading}</p>
            )}
          </div>
          {allLink?.enabled && allLink.link?.label && (
            <CMSLink appearance="default" {...allLink.link}>
              <ArrowRight aria-hidden="true" />
            </CMSLink>
          )}
        </div>

        <ul className="mt-10 md:mt-14 grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3 md:auto-rows-[minmax(15rem,auto)]" role="list">
          {list.map((item, i) => {
            const hasImage = i === 0 && item.image && typeof item.image === 'object'
            const Wrapper: React.ElementType = item.url ? Link : 'div'
            return (
              <li
                className={cn(layout[i % layout.length])}
                data-reveal
                key={item.id || i}
                style={{ '--i': i + 1 } as React.CSSProperties}
              >
                <Wrapper
                  {...(item.url ? { href: item.url } : {})}
                  className={cn(
                    'group relative flex h-full flex-col overflow-hidden rounded-card transition-transform duration-300',
                    item.url && 'hover:-translate-y-1',
                    hasImage ? 'min-h-[28rem] bg-corinto text-besh-suave' : cn('justify-end p-6 md:p-8', tones[i % tones.length]),
                  )}
                >
                  {hasImage ? (
                    <>
                      <div className="relative flex-1 min-h-[14rem]">
                        <Media
                          fill
                          imgClassName="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          resource={item.image}
                          size="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <div className="relative p-6 md:p-8">
                        <Number_ n={i + 1} />
                        <CardBody item={item} />
                      </div>
                    </>
                  ) : (
                    <>
                      <Number_ n={i + 1} />
                      <CardBody item={item} />
                    </>
                  )}
                </Wrapper>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
