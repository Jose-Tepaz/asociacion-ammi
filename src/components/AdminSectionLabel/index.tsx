'use client'

import { useRowLabel } from '@payloadcms/ui'
import React from 'react'

type Props = { tipo?: string }

type Node = { type?: string; text?: string; children?: Node[] }

/** Junta el texto de un nodo de texto enriquecido. */
const textOf = (node: Node): string =>
  node.text ?? (node.children || []).map(textOf).join('')

/** Busca el primer encabezado dentro de los textos enriquecidos de la sección. */
const findHeading = (value: unknown, depth = 0): string | undefined => {
  if (!value || typeof value !== 'object' || depth > 6) return undefined
  const node = value as Node & { root?: Node }
  if (node.root) return findHeading(node.root, depth + 1)
  if (node.type === 'heading') return textOf(node).trim() || undefined
  for (const child of Object.values(value)) {
    const found = Array.isArray(child)
      ? child.map((c) => findHeading(c, depth + 1)).find(Boolean)
      : findHeading(child, depth + 1)
    if (found) return found
  }
  return undefined
}

const textFields = ['heading', 'title', 'eyebrow', 'kicker', 'text']

/** Nombre de la sección: el que se escribió, o el título que tiene adentro. */
const sectionName = (data: Record<string, unknown> | undefined): string | undefined => {
  if (!data) return undefined
  if (typeof data.blockName === 'string' && data.blockName.trim()) return data.blockName.trim()
  for (const key of textFields) {
    const v = data[key]
    if (typeof v === 'string' && v.trim()) return v.trim()
  }
  return findHeading(data)
}

/** Encabezado de cada sección en el admin: número, tipo de sección y su nombre. */
export const SectionLabel: React.FC<Props> = ({ tipo }) => {
  const { data, rowNumber } = useRowLabel<Record<string, unknown>>()
  const name = sectionName(data)
  const number = String((rowNumber ?? 0) + 1).padStart(2, '0')

  return (
    <span className="ammi-section-label">
      <span className="ammi-section-label__number">{number}</span>
      {tipo && <span className="ammi-section-label__tipo">{tipo}</span>}
      <strong className="ammi-section-label__name">{name || 'Sin título'}</strong>
    </span>
  )
}
