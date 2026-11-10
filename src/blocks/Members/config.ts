import type { Block } from 'payload'

export const Members: Block = {
  slug: 'members',
  interfaceName: 'MembersBlock',
  labels: { singular: 'Organizaciones', plural: 'Organizaciones' },
  fields: [
    { name: 'kicker', label: 'Etiqueta sobre el título', type: 'text', defaultValue: 'Alianza' },
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
          'Se muestran en un carrusel de logos. Si una organización no tiene logo, se muestra su nombre corto (lo que va después de la última coma).',
      },
      fields: [
        {
          name: 'name',
          label: 'Nombre',
          type: 'text',
          required: true,
          admin: {
            description: 'Ej.: Asociación Política de Mujeres Mayas, Moloj. Sin logo se muestra «Moloj».',
          },
        },
        {
          name: 'logo',
          label: 'Logo',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'PNG con fondo transparente, de preferencia horizontal.' },
        },
      ],
    },
  ],
}
