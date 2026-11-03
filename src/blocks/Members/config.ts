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
      fields: [
        { name: 'name', label: 'Nombre', type: 'text', required: true },
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
