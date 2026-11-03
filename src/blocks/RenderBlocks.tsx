import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { AgendaBlock } from '@/blocks/Agenda/Component'
import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { IntroBlock } from '@/blocks/Intro/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { MembersBlock } from '@/blocks/Members/Component'
import { QuoteBlock } from '@/blocks/Quote/Component'
import { StripBlock } from '@/blocks/Strip/Component'
import { WorkAreasBlock } from '@/blocks/WorkAreas/Component'
import { cn } from '@/utilities/ui'

const blockComponents = {
  agenda: AgendaBlock,
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  intro: IntroBlock,
  mediaBlock: MediaBlock,
  members: MembersBlock,
  quote: QuoteBlock,
  strip: StripBlock,
  workAreas: WorkAreasBlock,
}

/** Bloques que ocupan un campo de color de borde a borde. */
const fieldBlocks = new Set(['cta', 'quote', 'workAreas'])

const toAnchor = (name: string) =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockName, blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]
            const isLast = index === blocks.length - 1

            if (Block) {
              return (
                <div
                  className={cn(
                    'scroll-mt-8',
                    !(isLast && fieldBlocks.has(blockType)) && 'mb-[var(--section-gap)]',
                  )}
                  // El «nombre del bloque» en el admin sirve de ancla: /#agenda
                  id={blockName ? toAnchor(blockName) : undefined}
                  key={index}
                >
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
