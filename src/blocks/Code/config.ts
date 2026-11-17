import type { Block } from 'payload'

export const Code: Block = {
  slug: 'code',
  labels: { singular: 'Código', plural: 'Códigos' },
  interfaceName: 'CodeBlock',
  fields: [
    {
      name: 'language',
      label: 'Lenguaje',
      type: 'select',
      defaultValue: 'typescript',
      options: [
        {
          label: 'Typescript',
          value: 'typescript',
        },
        {
          label: 'Javascript',
          value: 'javascript',
        },
        {
          label: 'CSS',
          value: 'css',
        },
      ],
    },
    {
      name: 'code',
      type: 'code',
      label: false,
      required: true,
    },
  ],
}
