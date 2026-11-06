import { cn } from '@/utilities/ui'
import React from 'react'

import { Card, CardPostData } from '@/components/Card'

export type Props = {
  posts: CardPostData[]
  /** En el celular las tarjetas van en un carrusel en lugar de una debajo de otra. */
  slideOnMobile?: boolean
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { posts, slideOnMobile } = props

  return (
    <div className={cn('container')}>
      <div>
        <div
          className={cn(
            'gap-6 sm:grid sm:grid-cols-8 lg:grid-cols-12',
            slideOnMobile
              ? '-mx-[var(--margin)] -my-2 flex snap-x snap-mandatory scroll-px-[var(--margin)] gap-4 overflow-x-auto px-[var(--margin)] py-2 [scrollbar-width:none] sm:mx-0 sm:my-0 sm:gap-6 sm:overflow-visible sm:px-0 sm:py-0 [&::-webkit-scrollbar]:hidden'
              : 'grid grid-cols-4',
          )}
        >
          {posts?.map((result, index) => {
            if (typeof result === 'object' && result !== null) {
              return (
                <div
                  className={cn('col-span-4', slideOnMobile && 'w-[85%] shrink-0 snap-start sm:w-auto')}
                  data-reveal
                  key={index}
                  style={{ '--i': index % 3 } as React.CSSProperties}
                >
                  <Card className="h-full" doc={result} relationTo="posts" showCategories />
                </div>
              )
            }

            return null
          })}
        </div>
      </div>
    </div>
  )
}
