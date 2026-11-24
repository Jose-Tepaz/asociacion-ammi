/* Formas de contacto del pie de página: tipo, enlace final e ícono. Sin imports de servidor: lo usa también el admin. */

export type ContactType = 'email' | 'phone' | 'whatsapp' | 'address' | 'contact' | 'link'

export const contactTypeOptions: { label: string; value: ContactType }[] = [
  { label: 'Correo', value: 'email' },
  { label: 'Teléfono', value: 'phone' },
  { label: 'WhatsApp', value: 'whatsapp' },
  { label: 'Dirección', value: 'address' },
  { label: 'Página de contacto', value: 'contact' },
  { label: 'Otro enlace', value: 'link' },
]

type Contact = { href?: string | null; type?: ContactType | null }

const digits = (text: string) => text.replace(/[^\d+]/g, '')

/** Tipo de la forma de contacto: el elegido en el admin o, si no hay, el que se deduce del enlace. */
export const contactType = ({ href, type }: Contact): ContactType => {
  if (type) return type
  const key = (href || '').trim().toLowerCase()
  if (!key) return 'address'
  if (key.startsWith('tel:')) return 'phone'
  if (key.includes('wa.me') || key.includes('whatsapp')) return 'whatsapp'
  if (key.startsWith('mailto:') || key.includes('@')) return 'email'
  if (key.includes('contact')) return 'contact'
  return 'link'
}

/**
 * Enlace final. Se puede escribir solo el correo o el número:
 * «alianza@gmail.com» → mailto:, «+502 1234 5678» → tel: o https://wa.me/ según el tipo.
 */
export const contactHref = (contact: Contact): string => {
  const raw = (contact.href || '').trim()
  if (!raw) return ''
  switch (contactType(contact)) {
    case 'email':
      return raw.toLowerCase().startsWith('mailto:') ? raw : `mailto:${raw}`
    case 'phone':
      return raw.toLowerCase().startsWith('tel:') ? raw : `tel:${digits(raw)}`
    case 'whatsapp':
      return /^https?:\/\//i.test(raw) ? raw : `https://wa.me/${digits(raw).replace('+', '')}`
    case 'contact':
    case 'link':
      return /^(https?:|mailto:|tel:|\/)/i.test(raw) ? raw : `https://${raw}`
    default:
      return raw
  }
}
