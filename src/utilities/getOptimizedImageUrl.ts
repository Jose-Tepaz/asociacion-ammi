import { getMediaUrl } from './getMediaUrl'

/** Calidad de las imágenes optimizadas. Debe estar en `images.qualities` de next.config. */
export const IMAGE_QUALITY = 80

/**
 * URL de una imagen de Media pasada por el optimizador de Next.js, para los casos en que no
 * se puede usar `<Image>` (fondos con CSS, logos en `<img>`).
 *
 * `width` debe ser uno de los anchos que acepta Next.js (`deviceSizes` o `imageSizes`):
 * 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048 o 3840.
 */
export const getOptimizedImageUrl = (
  url: string | null | undefined,
  cacheTag: string | null | undefined,
  width: number,
): string => {
  const src = getMediaUrl(url, cacheTag)
  if (!src) return ''
  // Los SVG no se optimizan: se sirven tal cual
  if (/\.svg(\?|$)/i.test(src)) return src

  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${IMAGE_QUALITY}`
}
