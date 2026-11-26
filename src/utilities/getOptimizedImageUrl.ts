import type { Media } from '@/payload-types'

import { getMediaUrl } from './getMediaUrl'

/**
 * Tamaños que Payload genera al subir cada imagen (ver `imageSizes` en `collections/Media.ts`).
 * `square` y `og` no se usan aquí porque vienen recortados.
 */
const SIZE_NAMES = ['thumbnail', 'small', 'medium', 'large', 'xlarge'] as const

type MediaWithSizes = Pick<Media, 'url' | 'updatedAt' | 'sizes'>

/**
 * URL de la versión de una imagen de Media más cercana al ancho pedido, usando los tamaños
 * que Payload ya generó al subirla. No pasa por el optimizador de imágenes de Vercel
 * (`/_next/image`), que tiene un cupo mensual: cuando se agota, todas las fotos del sitio
 * dejan de cargar (error 402).
 *
 * Devuelve el tamaño más chico que mida al menos `width`. Si ninguno alcanza, el más grande
 * que exista (hasta 1920 px). Si la imagen no tiene tamaños (SVG o imágenes más pequeñas que
 * 300 px), el archivo original.
 */
export const getMediaSizeUrl = (
  media: MediaWithSizes | null | undefined,
  width: number,
): string => {
  if (!media?.url) return ''

  const candidates = SIZE_NAMES.map((name) => media.sizes?.[name])
    .filter((size): size is { url: string; width: number } => Boolean(size?.url && size?.width))
    .sort((a, b) => a.width - b.width)

  const chosen = candidates.find((size) => size.width >= width) ?? candidates.at(-1)

  return getMediaUrl(chosen?.url ?? media.url, media.updatedAt)
}
