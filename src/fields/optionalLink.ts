import type { GroupField } from 'payload'

import { link } from './link'

/**
 * Un botón opcional: solo pide etiqueta y enlace cuando se activa,
 * así la sección se puede guardar sin él.
 */
export const optionalLink = (name: string, label: string, description?: string): GroupField => ({
  name,
  label,
  type: 'group',
  admin: description ? { description } : undefined,
  fields: [
    { name: 'enabled', label: 'Mostrar botón', type: 'checkbox' },
    link({
      appearances: false,
      overrides: {
        admin: { condition: (_, siblingData) => Boolean(siblingData?.enabled) },
      },
    }),
  ],
})
