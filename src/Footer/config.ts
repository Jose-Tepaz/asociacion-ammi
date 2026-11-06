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
      name: 'logo',
      label: 'Logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Opcional. Usa una versión clara del logo, porque el fondo es corinto. Si lo dejas vacío se usa el logo de AMMI.',
      },
    },
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
      admin: {
        description:
          'Con enlace aparece en Contáctanos con su ícono (tel:, https://wa.me/ o mailto:). Sin enlace aparece como dirección debajo del logo.',
      },
      fields: [
        { name: 'label', label: 'Texto visible', type: 'text', required: true },
        {
          name: 'href',
          label: 'Enlace',
          type: 'text',
          admin: { description: 'Por ejemplo tel:+50200000000 o https://wa.me/50200000000. Déjalo vacío si es una dirección.' },
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
