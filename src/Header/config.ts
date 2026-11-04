import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { optionalLink } from '@/fields/optionalLink'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Encabezado',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logo',
      label: 'Logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Opcional. Sube un logo horizontal, de preferencia con fondo transparente. Si lo dejas vacío se usa el logo de AMMI.',
      },
    },
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
    optionalLink(
      'action',
      'Botón de acción',
      'El botón destacado a la derecha del encabezado (por ejemplo, «Contáctanos»).',
    ),
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
