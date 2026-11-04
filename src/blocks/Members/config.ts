import type { Block } from 'payload'

export const Members: Block = {
  slug: 'members',
  interfaceName: 'MembersBlock',
  labels: { singular: 'Organizaciones', plural: 'Organizaciones' },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'heading', label: 'Título (primera línea)', type: 'text', required: true },
        { name: 'headingSecond', label: 'Título (segunda línea)', type: 'text' },
      ],
    },
    { name: 'intro', label: 'Texto', type: 'textarea' },
    {
      name: 'organizations',
      label: 'Organizaciones',
      type: 'array',
      admin: {
        description:
          'Se agrupan por «Categoría», en el orden en que aparece cada categoría por primera vez. Sin logo, se muestran las siglas.',
      },
      fields: [
        { name: 'name', label: 'Nombre', type: 'text', required: true },
        {
          type: 'row',
          fields: [
            {
              name: 'acronym',
              label: 'Siglas o nombre corto',
              type: 'text',
              admin: { description: 'Se muestran si no hay logo. Ej.: UNAMG, Moloj.' },
            },
            {
              name: 'category',
              label: 'Categoría',
              type: 'text',
              admin: { description: 'Ej.: Participación política. Escríbela igual en cada organización del grupo.' },
            },
          ],
        },
        {
          name: 'logo',
          label: 'Logo',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'PNG con fondo transparente, de preferencia horizontal.' },
        },
        {
          type: 'row',
          fields: [
            { name: 'focus', label: 'Enfoque o pueblo', type: 'text' },
            { name: 'place', label: 'Territorio', type: 'text' },
          ],
        },
        { name: 'url', label: 'Sitio web o red', type: 'text' },
      ],
    },
  ],
}
