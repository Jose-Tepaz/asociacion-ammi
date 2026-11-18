import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

/**
 * Datos del bloque «Aviso destacado». Se define aquí porque el bloque ya no está en el editor
 * de publicaciones (y por eso no sale en payload-types), pero el sitio todavía sabe mostrarlo
 * si alguna publicación vieja lo tiene.
 */
export type BannerBlockProps = {
  style: 'info' | 'warning' | 'error' | 'success'
  content: DefaultTypedEditorState
  id?: string | null
  blockName?: string | null
  blockType: 'banner'
}

import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

type Props = {
  className?: string
} & BannerBlockProps

export const BannerBlock: React.FC<Props> = ({ className, content, style }) => {
  return (
    <div className={cn('mx-auto my-8 w-full', className)}>
      <div
        className={cn('border py-3 px-6 flex items-center rounded', {
          'border-border bg-card': style === 'info',
          'border-error bg-error/30': style === 'error',
          'border-success bg-success/30': style === 'success',
          'border-warning bg-warning/30': style === 'warning',
        })}
      >
        <RichText data={content} enableGutter={false} enableProse={false} />
      </div>
    </div>
  )
}
