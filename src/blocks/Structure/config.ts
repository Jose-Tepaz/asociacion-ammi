import type { Block } from 'payload'

// Íconos disponibles (Lucide). El valor se traduce a un ícono en Component.tsx
export const structureIcons = [
  { label: 'Grupo de personas', value: 'users' },
  { label: 'Bandera', value: 'flag' },
  { label: 'Red / conexiones', value: 'network' },
  { label: 'Computadora', value: 'laptop' },
  { label: 'Manos unidas', value: 'handshake' },
  { label: 'Persona', value: 'user' },
  { label: 'Balanza (justicia)', value: 'scale' },
  { label: 'Megáfono', value: 'megaphone' },
  { label: 'Libro', value: 'book' },
  { label: 'Brote', value: 'sprout' },
] as const

export const Structure: Block = {
  slug: 'structure',
  interfaceName: 'StructureBlock',
  labels: { singular: 'Cómo nos organizamos', plural: 'Cómo nos organizamos' },
  fields: [
    { name: 'kicker', label: 'Etiqueta sobre el título', type: 'text', defaultValue: 'Nosotras' },
    { name: 'heading', label: 'Título', type: 'text', required: true, defaultValue: 'Cómo nos organizamos' },
    {
      name: 'intro',
      label: 'Texto',
      type: 'textarea',
      admin: { description: 'Dos o tres líneas como máximo.' },
      defaultValue:
        'Las decisiones se toman entre todas. Cada espacio cumple un papel claro dentro de la Alianza.',
    },
    {
      name: 'image',
      label: 'Imagen del centro (opcional)',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Se recorta en círculo. Si no eliges una, se muestra el símbolo de AMMI.' },
    },
    {
      name: 'items',
      label: 'Espacios',
      type: 'array',
      minRows: 2,
      maxRows: 6,
      admin: { description: 'Los primeros tres van a la izquierda y los siguientes a la derecha.' },
      defaultValue: [
        {
          icon: 'users',
          title: 'Asamblea',
          description: 'Se reúne cada mes. La integran las organizaciones y mujeres que ratifican cada año su pertenencia.',
        },
        {
          icon: 'flag',
          title: 'Consejo Político',
          description: 'Toma decisiones de forma colegiada y conduce la línea política y los proyectos.',
        },
        {
          icon: 'network',
          title: 'Coordinación Política',
          description: 'Una organización integrante, elegida cada año, que conduce las acciones políticas.',
        },
        {
          icon: 'laptop',
          title: 'Equipo técnico',
          description: 'Coordinación, administración y comunicación social al servicio de todos los espacios.',
        },
        {
          icon: 'handshake',
          title: 'Organizaciones integrantes',
          description: 'Organizaciones de mujeres y mujeres indígenas que aportan desde sus territorios.',
        },
        {
          icon: 'user',
          title: 'Mujeres a título individual',
          description: 'Lideresas que participan por cuenta propia y fortalecen los procesos de la Alianza.',
        },
      ],
      fields: [
        {
          name: 'icon',
          label: 'Ícono',
          type: 'select',
          required: true,
          defaultValue: 'users',
          options: [...structureIcons],
        },
        { name: 'title', label: 'Nombre', type: 'text', required: true },
        {
          name: 'description',
          label: 'Descripción',
          type: 'textarea',
          required: true,
          admin: { description: 'Una sola frase, unas 15 palabras.' },
        },
      ],
    },
  ],
}
