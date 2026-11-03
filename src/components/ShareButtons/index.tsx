'use client'

import { Check, Facebook, Link2, MessageCircle, Twitter } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const buttonClasses =
  'grid size-11 place-items-center rounded-full bg-besh-suave text-corinto transition-colors hover:bg-corinto hover:text-besh-suave'

/** Compartir la página actual en redes o copiar su enlace. */
export const ShareButtons: React.FC<{ title: string }> = ({ title }) => {
  const [url, setUrl] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => setUrl(window.location.href.split('#')[0]!), [])

  const enc = encodeURIComponent
  const links = [
    { label: 'Compartir en WhatsApp', href: `https://wa.me/?text=${enc(`${title} ${url}`)}`, Icon: MessageCircle },
    { label: 'Compartir en Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`, Icon: Facebook },
    { label: 'Compartir en X', href: `https://x.com/intent/post?text=${enc(title)}&url=${enc(url)}`, Icon: Twitter },
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
    <div>
      <p className="text-step-small font-medium">Compartir</p>
      <ul className="mt-3 flex gap-2">
        {links.map(({ href, Icon, label }) => (
          <li key={label}>
            <a aria-label={label} className={buttonClasses} href={href} rel="noopener noreferrer" target="_blank">
              <Icon aria-hidden="true" className="size-5" />
            </a>
          </li>
        ))}
        <li>
          <button aria-label={copied ? 'Enlace copiado' : 'Copiar enlace'} className={buttonClasses} onClick={copy} type="button">
            {copied ? <Check aria-hidden="true" className="size-5" /> : <Link2 aria-hidden="true" className="size-5" />}
          </button>
        </li>
      </ul>
      <p aria-live="polite" className="sr-only">
        {copied ? 'Enlace copiado.' : ''}
      </p>
    </div>
  )
}
