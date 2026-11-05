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
import { MissionBlock } from '@/blocks/Mission/Component'
import { QuoteBlock } from '@/blocks/Quote/Component'
import { SocialGalleryBlock } from '@/blocks/SocialGallery/Component'
import { StatementBlock } from '@/blocks/Statement/Component'
import { StripBlock } from '@/blocks/Strip/Component'
import { StructureBlock } from '@/blocks/Structure/Component'
import { TimelineBlock } from '@/blocks/Timeline/Component'
import { WorkAreasBlock } from '@/blocks/WorkAreas/Component'
import { PanelStack } from '@/components/PanelStack'
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
  mission: MissionBlock,
  quote: QuoteBlock,
  socialGallery: SocialGalleryBlock,
  statement: StatementBlock,
  strip: StripBlock,
  structure: StructureBlock,
  timeline: TimelineBlock,
  workAreas: WorkAreasBlock,
}

/** Bloques que ocupan un campo de color de borde a borde. */
const fieldBlocks = new Set(['agenda', 'quote', 'workAreas', 'socialGallery'])

/** Bloques que ya traen su propio espacio (clase section-pad). */
const selfPadded = new Set(['structure', 'members', 'mission', 'timeline', 'statement'])

type AnyBlock = Page['layout'][0]

// Una foto de borde a borde también es un campo: va pegada a lo que la rodea
const isField = (block?: AnyBlock) =>
  Boolean(
    block &&
      (fieldBlocks.has(block.blockType) || selfPadded.has(block.blockType) || (block.blockType === 'mediaBlock' && block.fullBleed)),
  )

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
  // Varias presentaciones en una misma página se muestran como paneles de color numerados
  const isIntro = (block: AnyBlock) => block.blockType === 'intro'
  const introCount = hasBlocks ? blocks.filter(isIntro).length : 0

  if (hasBlocks) {
    const items = blocks.map((block, index) => {
      const { blockName, blockType } = block
      const Block = blockType && blockType in blockComponents ? blockComponents[blockType] : null
      const panelPosition =
        introCount > 1 && isIntro(block) ? blocks.slice(0, index).filter(isIntro).length : undefined
      const isPanel = panelPosition !== undefined
      // El «nombre del bloque» en el admin sirve de ancla: /#agenda
      const anchor = blockName ? toAnchor(blockName) : undefined

      return {
        isPanel,
        node: Block ? (
          <Fragment key={index}>
            {/* Un panel fijo no marca su lugar en la página: el ancla va en un punto aparte */}
            {isPanel && <span className="scroll-mt-8" id={anchor} />}
            <div
              // Los campos de color ya traen su propio espacio; el resto lleva 96px arriba y abajo
              className={cn('scroll-mt-8', !isField(block) && !isPanel && 'py-[var(--section-y)]')}
              id={isPanel ? undefined : anchor}
              style={isPanel ? ({ '--stack': panelPosition } as React.CSSProperties) : undefined}
            >
              {/* @ts-expect-error there may be some mismatch between the expected types here */}
              <Block {...block} disableInnerContainer panelPosition={panelPosition} />
            </div>
          </Fragment>
        ) : null,
      }
    })

    // Los paneles seguidos van juntos: se quedan fijos y se sobreponen al hacer scroll
    const runs = items.reduce<(typeof items)[]>((acc, item) => {
      const last = acc[acc.length - 1]
      if (item.isPanel && last?.[0]?.isPanel) last.push(item)
      else acc.push([item])
      return acc
    }, [])

    return (
      <Fragment>
        {runs.map((run, i) =>
          run[0]?.isPanel ? (
            <PanelStack key={`paneles-${i}`}>{run.map((item) => item.node)}</PanelStack>
          ) : (
            run.map((item) => item.node)
          ),
        )}
      </Fragment>
    )
  }

  return null
}
