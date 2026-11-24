import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { contactTypeOptions } from '@/utilities/contactLink'
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
      labels: { singular: 'Forma de contacto', plural: 'Formas de contacto' },
      admin: {
        description:
          'Correo, teléfono, WhatsApp y otros enlaces aparecen en Contáctanos con su ícono. La dirección aparece debajo del logo.',
        components: {
          RowLabel: '@/Footer/ContactRowLabel#ContactRowLabel',
        },
      },
      fields: [
        {
          name: 'type',
          label: 'Tipo (ícono)',
          type: 'select',
          options: contactTypeOptions,
          admin: {
            description: 'Elige qué ícono se muestra. Si lo dejas vacío, se adivina por el enlace.',
          },
        },
        { name: 'label', label: 'Texto visible', type: 'text', required: true },
        {
          name: 'href',
          label: 'Correo, número o enlace',
          type: 'text',
          admin: {
            description:
              'Escribe solo el correo (alianza@ejemplo.org) o el número con código de país (+502 1234 5678): el sitio arma el enlace. En Dirección déjalo vacío: al tocarla abre el mapa.',
            condition: (_, siblingData) => siblingData?.type !== 'address',
          },
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
      maxRows: 10,
      labels: { singular: 'Red social', plural: 'Redes sociales' },
      admin: {
        description:
          'Toca el ícono de la red y pega su URL. Si la red no está, escribe su nombre: sale con un globo.',
        components: {
          RowLabel: '@/Footer/SocialRowLabel#SocialRowLabel',
        },
      },
      fields: [
        {
          name: 'label',
          label: 'Red',
          type: 'text',
          required: true,
          admin: {
            components: { Field: '@/components/AdminSocialPicker#SocialPicker' },
          },
        },
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
