import type { Block } from 'payload'

export const SocialGallery: Block = {
  slug: 'socialGallery',
  interfaceName: 'SocialGalleryBlock',
  labels: { singular: 'Galería de redes', plural: 'Galerías de redes' },
  fields: [
    { name: 'heading', label: 'Título', type: 'text', required: true, defaultValue: 'Síguenos en Instagram' },
    {
      type: 'row',
      fields: [
        { name: 'handle', label: 'Usuario', type: 'text', admin: { placeholder: '@ammi.guatemala' } },
        { name: 'description', label: 'Descripción', type: 'text' },
      ],
    },
    { name: 'profileUrl', label: 'Enlace al perfil', type: 'text' },
    {
      name: 'posts',
      label: 'Publicaciones',
      type: 'array',
      minRows: 1,
      admin: { description: 'Sube las piezas que quieras mostrar y, si quieres, el enlace a cada publicación.' },
      fields: [
        { name: 'image', label: 'Imagen', type: 'upload', relationTo: 'media', required: true },
        { name: 'url', label: 'Enlace a la publicación', type: 'text' },
      ],
    },
  ],
}
