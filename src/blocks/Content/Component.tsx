import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import type { ContentBlock as ContentBlockProps } from '@/payload-types'

import { CMSLink } from '../../components/Link'

/**
 * Página de texto: los títulos empiezan en el eje (42 % del ancho)
 * y el cuerpo cuelga de él a una medida de lectura.
 */
export const ContentBlock: React.FC<ContentBlockProps> = (props) => {
  const { columns } = props

  const colsSpanClasses = {
    full: 'lg:col-span-7 lg:col-start-6',
    half: 'lg:col-span-6',
    oneThird: 'lg:col-span-4',
    twoThirds: 'lg:col-span-8',
  }

  return (
    <section className="container">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-y-12 gap-x-8">
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const { enableLink, link, richText, size } = col

            return (
              <div
                className={cn(colsSpanClasses[size!], { 'md:col-span-2': size === 'full' })}
                data-reveal
                key={index}
                style={{ '--i': index } as React.CSSProperties}
              >
                {richText && (
                  <RichText data={richText} enableGutter={false} />
                )}

                {enableLink && <CMSLink className="mt-8" size="lg" {...link} />}
              </div>
            )
          })}
      </div>
    </section>
  )
}
