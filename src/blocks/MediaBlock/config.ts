import type { Block } from 'payload'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  labels: { singular: 'Imagen', plural: 'Imágenes' },
  fields: [
    {
      name: 'media',
      label: 'Imagen o video',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: { description: 'Para cambiar solo esta sección, elige o sube otra imagen aquí. No reemplaces el archivo desde «Medios»: cambiaría en todas las secciones que usen esa misma imagen.' },
    },
    {
      name: 'fullBleed',
      label: 'Franja de borde a borde',
      type: 'checkbox',
      admin: { description: 'Ocupa todo el ancho de la pantalla, como una fotografía de grupo.' },
    },
    {
      name: 'overlayText',
      label: 'Frase sobre la foto',
      type: 'textarea',
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.fullBleed),
        description: 'Una frase corta, por ejemplo una consigna de la Alianza.',
      },
    },
    {
      name: 'overlayAuthor',
      label: 'Firma de la frase',
      type: 'text',
      admin: { condition: (_, siblingData) => Boolean(siblingData?.fullBleed && siblingData?.overlayText) },
    },
  ],
}
