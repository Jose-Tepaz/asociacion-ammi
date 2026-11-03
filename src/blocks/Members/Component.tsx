import React from 'react'

import type { MembersBlock as MembersBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'

export const MembersBlock: React.FC<MembersBlockProps> = ({ heading, headingSecond, intro, organizations }) => {
  const list = organizations || []
  const showFocus = list.some((org) => org.focus)
  const showPlace = list.some((org) => org.place)

  return (
    <section className="container">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-8 lg:items-end">
        <h2 className="lg:col-span-7 text-step-head" data-reveal>
          <span className="block">{heading}</span>
          {headingSecond && <span className="block md:ps-[16.6%]">{headingSecond}</span>}
        </h2>
        {intro && (
          <p className="lg:col-span-4 lg:col-start-9 text-step-body max-w-[42ch]" data-reveal style={{ '--i': 1 } as React.CSSProperties}>
            {intro}
          </p>
        )}
      </div>

      {list.length > 0 && (
        <table className="mt-16 md:mt-20 w-full border-collapse text-left" data-reveal style={{ '--i': 2 } as React.CSSProperties}>
          <caption className="sr-only">Organizaciones que integran la Alianza</caption>
          <thead className="sr-only md:not-sr-only">
            <tr className="text-step-small text-muted-foreground">
              <th className="py-3 px-4 font-normal md:w-1/2" scope="col">
                Organización
              </th>
              {showFocus && (
                <th className="py-3 px-4 font-normal" scope="col">
                  Enfoque
                </th>
              )}
              {showPlace && (
                <th className="py-3 px-4 font-normal text-right" scope="col">
                  Territorio
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {list.map((org, i) => (
              <tr className={cn('flex flex-col md:table-row', i % 2 === 0 && 'bg-besh-fuerte')} key={org.id || i}>
                <th className="px-4 py-4 font-medium text-step-body" scope="row">
                  {org.url ? (
                    <a className="underline-offset-4 decoration-fucsia decoration-2 hover:underline" href={org.url} rel="noopener noreferrer" target="_blank">
                      {org.name}
                    </a>
                  ) : (
                    org.name
                  )}
                </th>
                {showFocus && (
                  <td className="px-4 pb-4 md:py-4 text-step-body text-muted-foreground md:text-foreground">{org.focus}</td>
                )}
                {showPlace && (
                  <td className="px-4 pb-4 md:py-4 text-step-body text-muted-foreground md:text-right">{org.place}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
