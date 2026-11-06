import { Globe, Mail, Phone } from 'lucide-react'
import React from 'react'
import { FaFacebookF, FaInstagram, FaWhatsapp, FaXTwitter, FaYoutube } from 'react-icons/fa6'

/** Elige el ícono de la red a partir de su nombre o su URL. */
export const SocialIcon: React.FC<{ className?: string; name: string; url?: string }> = ({
  className,
  name,
  url = '',
}) => {
  const key = `${name} ${url}`.toLowerCase()
  const Icon = key.includes('instagram')
    ? FaInstagram
    : key.includes('facebook')
      ? FaFacebookF
      : key.includes('youtube') || key.includes('youtu.be')
        ? FaYoutube
        : key.includes('whatsapp') || key.includes('wa.me')
          ? FaWhatsapp
          : key.includes('twitter') || key.includes('x.com')
            ? FaXTwitter
            : Globe
  return <Icon aria-hidden="true" className={className} />
}

/** Ícono de una forma de contacto según su enlace: teléfono, WhatsApp o correo. */
export const ContactIcon: React.FC<{ className?: string; href: string }> = ({ className, href }) => {
  const key = href.toLowerCase()
  const Icon = key.startsWith('tel:')
    ? Phone
    : key.includes('wa.me') || key.includes('whatsapp')
      ? FaWhatsapp
      : Mail
  return <Icon aria-hidden="true" className={className} />
}
