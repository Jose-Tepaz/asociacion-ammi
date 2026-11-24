'use client'
import type { Footer } from '@/payload-types'
import { type RowLabelProps, useRowLabel } from '@payloadcms/ui'
import React from 'react'

import { SocialIcon } from '@/components/SocialIcon'

/** En el admin, cada red social muestra su ícono y su nombre. */
export const SocialRowLabel: React.FC<RowLabelProps> = () => {
  const { data, rowNumber } = useRowLabel<NonNullable<Footer['socialLinks']>[number]>()
  const text = data?.label || `Red ${(rowNumber ?? 0) + 1}`

  return (
    <span style={{ alignItems: 'center', display: 'inline-flex', gap: '0.6rem' }}>
      <SocialIcon name={data?.label} style={{ height: 18, width: 18 }} url={data?.url} />
      {text}
    </span>
  )
}
