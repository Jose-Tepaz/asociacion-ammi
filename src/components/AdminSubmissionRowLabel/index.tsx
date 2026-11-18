'use client'

import { useRowLabel } from '@payloadcms/ui'
import React from 'react'

/** Fila de «Datos enviados»: muestra el campo y la respuesta, por ejemplo «Nombre: Ana». */
export const SubmissionRowLabel: React.FC = () => {
  const { data, rowNumber } = useRowLabel<{ field?: string; value?: string }>()
  const field = (data?.field || '').replace(/[_-]+/g, ' ').trim()
  const name = field ? field.charAt(0).toUpperCase() + field.slice(1) : `Dato ${(rowNumber ?? 0) + 1}`
  const value = (data?.value || '').toString()
  const short = value.length > 80 ? `${value.slice(0, 80)}…` : value

  return (
    <span>
      <strong>{name}</strong>
      {short && `: ${short}`}
    </span>
  )
}
