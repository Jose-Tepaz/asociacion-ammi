'use client'
import type { Footer } from '@/payload-types'
import { type RowLabelProps, useRowLabel } from '@payloadcms/ui'
import React from 'react'

import { ContactIcon } from '@/components/SocialIcon'

/** En el admin, cada forma de contacto muestra su ícono y su texto en lugar de «Contact 01». */
export const ContactRowLabel: React.FC<RowLabelProps> = () => {
  const { data, rowNumber } = useRowLabel<NonNullable<Footer['contacts']>[number]>()
  const text = data?.label || `Contacto ${(rowNumber ?? 0) + 1}`

  return (
    <span style={{ alignItems: 'center', display: 'inline-flex', gap: '0.6rem' }}>
      <ContactIcon
        href={data?.href}
        label={data?.label}
        style={{ height: 18, width: 18 }}
        type={data?.type}
      />
      {text}
    </span>
  )
}
