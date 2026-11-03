import { Download, Eye, FileSpreadsheet, FileText, File as FileIcon } from 'lucide-react'
import React from 'react'

import type { Media } from '@/payload-types'

import { getMediaUrl } from '@/utilities/getMediaUrl'

export type DocumentItem = { file: Media; title?: string | null }

const formatSize = (bytes?: number | null) => {
  if (!bytes) return null
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toLocaleString('es-GT', { maximumFractionDigits: 1 })} MB`
}

const typeOf = (file: Media) => {
  const name = file.filename || ''
  const ext = name.includes('.') ? name.split('.').pop()!.toUpperCase() : ''
  const mime = file.mimeType || ''
  if (mime.includes('pdf')) return { label: 'PDF', Icon: FileText, viewable: true }
  if (mime.includes('sheet') || mime.includes('excel') || ['XLS', 'XLSX', 'CSV'].includes(ext))
    return { label: ext || 'Hoja de cálculo', Icon: FileSpreadsheet, viewable: false }
  if (mime.includes('word') || ['DOC', 'DOCX'].includes(ext)) return { label: ext || 'Word', Icon: FileText, viewable: false }
  if (mime.startsWith('image/')) return { label: ext || 'Imagen', Icon: FileIcon, viewable: true }
  return { label: ext || 'Archivo', Icon: FileIcon, viewable: false }
}

/** Archivos de una publicación como tarjetas: tipo, nombre, peso y botones para ver o descargar. */
export const PostDocuments: React.FC<{ items: DocumentItem[] }> = ({ items }) => (
  <div className="rounded-card bg-besh-fuerte p-5">
    <p className="text-step-small font-medium">
      {items.length === 1 ? 'Documento para descargar' : `Documentos para descargar (${items.length})`}
    </p>
    <ul className="mt-4 flex flex-col gap-3" role="list">
      {items.map(({ file, title }) => {
        const { Icon, label, viewable } = typeOf(file)
        const url = getMediaUrl(file.url, file.updatedAt)
        const name = title || file.alt || file.filename || 'Documento'
        const size = formatSize(file.filesize)
        return (
          <li className="rounded-2xl bg-besh-suave p-4" key={file.id}>
            <div className="flex items-start gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-corinto text-besh-suave">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-step-small font-medium leading-snug line-clamp-2">{name}</p>
                <p className="mt-0.5 text-step-small text-texto-secundario">{[label, size].filter(Boolean).join(' · ')}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              {viewable && (
                <a
                  className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full border-[1.5px] border-corinto/40 text-step-small font-medium text-corinto transition-colors hover:border-corinto hover:bg-corinto hover:text-besh-suave"
                  href={url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Eye aria-hidden="true" className="size-4" />
                  Ver
                </a>
              )}
              <a
                className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full bg-corinto text-step-small font-medium text-besh-suave transition-colors hover:bg-corinto-terciario"
                download={file.filename || true}
                href={url}
              >
                <Download aria-hidden="true" className="size-4" />
                Descargar
              </a>
            </div>
          </li>
        )
      })}
    </ul>
  </div>
)
