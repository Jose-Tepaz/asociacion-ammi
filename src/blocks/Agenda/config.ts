import type { Block } from 'payload'

import { optionalLink } from '@/fields/optionalLink'

export const Agenda: Block = {
  slug: 'agenda',
  interfaceName: 'AgendaBlock',
  labels: { singular: 'Agenda', plural: 'Agendas' },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'heading', label: 'Título (primera línea)', type: 'text', required: true },
        { name: 'headingSecond', label: 'Título (segunda línea)', type: 'text' },
      ],
    },
    optionalLink('action', 'Botón (inscripción o transmisión)'),
    {
      name: 'events',
      label: 'Actividades',
      type: 'array',
      minRows: 1,
      admin: { description: 'Las actividades del mismo día se agrupan en una pestaña.' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'date',
              label: 'Fecha',
              type: 'date',
              required: true,
              admin: { width: '34%', date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' } },
            },
            { name: 'time', label: 'Horario', type: 'text', admin: { width: '33%', placeholder: '9:30 a 12:00' } },
            { name: 'kind', label: 'Tipo', type: 'text', admin: { width: '33%', placeholder: 'Conversatorio' } },
          ],
        },
        { name: 'title', label: 'Título', type: 'text', required: true },
        {
          type: 'row',
          fields: [
            { name: 'place', label: 'Lugar', type: 'text', admin: { width: '50%' } },
            { name: 'people', label: 'Participan', type: 'text', admin: { width: '50%' } },
          ],
        },
        { name: 'url', label: 'Enlace (opcional)', type: 'text' },
      ],
    },
  ],
}
