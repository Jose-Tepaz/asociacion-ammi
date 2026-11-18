'use client'

import React from 'react'

/* Columnas de la lista «Respuestas de formularios»: toman el dato de lo que envió la persona. */

type Row = { field?: string; value?: unknown }
type CellProps = { rowData?: { submissionData?: Row[] } }

const find = (rowData: CellProps['rowData'], pattern: RegExp): string => {
  const row = (rowData?.submissionData || []).find((r) => r.field && pattern.test(r.field))
  return row?.value == null ? '' : String(row.value)
}

const shorten = (text: string, max: number) => (text.length > max ? `${text.slice(0, max)}…` : text)

export const NameCell: React.FC<CellProps> = ({ rowData }) => (
  <span>{find(rowData, /nombre|name/i) || '—'}</span>
)

export const EmailCell: React.FC<CellProps> = ({ rowData }) => (
  <span>{find(rowData, /correo|email/i) || '—'}</span>
)

export const MessageCell: React.FC<CellProps> = ({ rowData }) => (
  <span title={find(rowData, /mensaje|message/i)}>{shorten(find(rowData, /mensaje|message/i), 70) || '—'}</span>
)
