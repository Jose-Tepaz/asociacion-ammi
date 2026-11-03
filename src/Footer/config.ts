import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Pie de página',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'statement',
      label: 'Frase de cierre',
      type: 'textarea',
      admin: { description: 'Una o dos líneas que acompañan al logo.' },
    },
    {
      name: 'contacts',
      label: 'Formas de contacto',
      type: 'array',
      maxRows: 4,
      admin: { description: 'Correo, teléfono o dirección. Se muestran en grande.' },
      fields: [
        { name: 'label', label: 'Texto visible', type: 'text', required: true },
        {
          name: 'href',
          label: 'Enlace',
          type: 'text',
          admin: { description: 'mailto:, tel: o una URL. Opcional.' },
        },
      ],
    },
    {
      name: 'navItems',
      label: 'Enlaces del sitio',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 8,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'socialLinks',
      label: 'Redes sociales',
      type: 'array',
      maxRows: 6,
      fields: [
        { name: 'label', label: 'Red', type: 'text', required: true },
        { name: 'url', label: 'URL', type: 'text', required: true },
      ],
    },
    {
      name: 'legal',
      label: 'Línea legal',
      type: 'text',
      admin: { description: 'Por ejemplo: administrada por la Asociación Política de Mujeres Mayas, Moloj.' },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
