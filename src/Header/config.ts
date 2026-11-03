import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Encabezado',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      label: 'Enlaces del menú',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 5,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'action',
      label: 'Botón de acción',
      type: 'group',
      admin: {
        description: 'El botón destacado a la derecha del encabezado (por ejemplo, «Súmate»).',
      },
      fields: [
        link({
          appearances: false,
          overrides: { label: false },
        }),
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
