import type { FieldHook } from 'payload'

type LexicalNode = { type?: string; tag?: string; children?: LexicalNode[]; [k: string]: unknown }
type LexicalValue = { root?: LexicalNode } | null | undefined

/**
 * El título de las portadas siempre es un Encabezado 1, aunque en el editor ya no se pueda
 * elegir el tipo de texto: si la primera línea quedó como párrafo, se convierte en título.
 * Así, si alguien borra y vuelve a escribir el título, mantiene el tamaño del diseño.
 */
export const firstLineAsTitle: FieldHook = ({ value }) => {
  const data = value as LexicalValue
  const children = data?.root?.children
  if (!children?.length) return value

  const hasTitle = children.some((node) => node.type === 'heading')
  const first = children[0]
  if (hasTitle || first?.type !== 'paragraph') return value

  const { textFormat: _textFormat, textStyle: _textStyle, ...rest } = first
  const heading: LexicalNode = { ...rest, type: 'heading', tag: 'h1' }

  return { ...data, root: { ...data!.root, children: [heading, ...children.slice(1)] } }
}

/**
 * Texto de las publicaciones: el editor ya no tiene tamaños de texto, así que los títulos que
 * quedaron de antes se guardan como texto normal (si no, Payload no deja guardar).
 */
export const headingsAsParagraphs: FieldHook = ({ value }) => {
  const data = value as LexicalValue
  const children = data?.root?.children
  if (!children?.some((node) => node.type === 'heading')) return value

  return {
    ...data,
    root: {
      ...data!.root,
      children: children.map((node) => {
        if (node.type !== 'heading') return node
        const { tag: _tag, ...rest } = node
        return { ...rest, type: 'paragraph', textFormat: 0, textStyle: '' }
      }),
    },
  }
}
