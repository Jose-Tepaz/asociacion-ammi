'use client'

import React, { useEffect, useState } from 'react'
import { TbBrandFacebook, TbBrandWhatsapp, TbBrandX, TbCheck, TbLink } from 'react-icons/tb'

const buttonClasses =
  'grid size-11 place-items-center rounded-full bg-besh-suave text-corinto transition-colors hover:bg-corinto hover:text-besh-suave'

/** Compartir la página actual en redes o copiar su enlace. */
export const ShareButtons: React.FC<{ title: string }> = ({ title }) => {
  const [url, setUrl] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => setUrl(window.location.href.split('#')[0]!), [])

  const enc = encodeURIComponent
  const links = [
    { label: 'Compartir en WhatsApp', href: `https://wa.me/?text=${enc(`${title} ${url}`)}`, Icon: TbBrandWhatsapp },
    { label: 'Compartir en Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`, Icon: TbBrandFacebook },
    { label: 'Compartir en X', href: `https://x.com/intent/post?text=${enc(title)}&url=${enc(url)}`, Icon: TbBrandX },
  ]

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Sin acceso al portapapeles: el enlace sigue en la barra del navegador
    }
  }

  return (
    // En celular con espacio (de 416 a 767 px, p. ej. horizontal) el título va a la izquierda y los botones a la derecha;
    // en celular angosto, tablet y escritorio, el título arriba y los botones debajo, sin quedar apretados
    <div className="flex flex-col gap-3 min-[26rem]:max-md:flex-row min-[26rem]:max-md:items-center min-[26rem]:max-md:justify-between min-[26rem]:max-md:gap-6">
      <p className="text-step-small font-medium">Compartir</p>
      <ul className="flex gap-2">
        {links.map(({ href, Icon, label }) => (
          <li key={label}>
            <a aria-label={label} className={buttonClasses} href={href} rel="noopener noreferrer" target="_blank">
              <Icon aria-hidden="true" className="size-5" />
            </a>
          </li>
        ))}
        <li>
          <button aria-label={copied ? 'Enlace copiado' : 'Copiar enlace'} className={buttonClasses} onClick={copy} type="button">
            {copied ? <TbCheck aria-hidden="true" className="size-5" /> : <TbLink aria-hidden="true" className="size-5" />}
          </button>
        </li>
      </ul>
      <p aria-live="polite" className="sr-only">
        {copied ? 'Enlace copiado.' : ''}
      </p>
    </div>
  )
}
