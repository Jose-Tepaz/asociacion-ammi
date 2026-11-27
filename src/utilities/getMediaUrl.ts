import { toDirectFileUrl } from './directMediaFile'

/**
 * Processes media resource URL to ensure proper formatting
 * @param url The original URL from the resource
 * @param cacheTag Optional cache tag to append to the URL
 * @returns Properly formatted URL with cache tag if provided
 *
 * Las imágenes se piden a `/archivos/...` en vez de `/api/media/file/...`, para que no enciendan
 * la base de datos (ver `directMediaFile.ts`). PDF, video y SVG siguen saliendo de Payload.
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''

  const src = toDirectFileUrl(url)

  if (cacheTag && cacheTag !== '') {
    cacheTag = encodeURIComponent(cacheTag)
  }

  return cacheTag ? `${src}?${cacheTag}` : src
}
