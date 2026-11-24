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
    // Hasta tablet el título va a la izquierda y los botones a la derecha en una sola fila; cuando no queda al menos
    // 20 px entre los dos (gap-x-5), los botones bajan solos a la línea de abajo (flex-wrap), sin importar el ancho exacto.
    // Desde tablet, donde la tarjeta es angosta, siempre en columna como antes.
    <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 md:flex-col md:items-start md:justify-start md:gap-3">
      <p className="text-step-body font-medium">Compartir</p>
      {/* Los botones ocupan el espacio libre (hasta 18 rem) y se reparten en él; al bajar a su propia línea
          quedan repartidos de lado a lado, sin hueco a la derecha. Desde tablet, a todo el ancho de la tarjeta */}
      <ul className="flex shrink-0 grow justify-between gap-2 max-w-[18rem] md:w-full md:max-w-none">
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
