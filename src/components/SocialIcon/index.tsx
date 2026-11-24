import { Globe, Link2, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import React from 'react'
import {
  FaBluesky,
  FaDiscord,
  FaFacebookF,
  FaFlickr,
  FaInstagram,
  FaLinkedinIn,
  FaMastodon,
  FaMedium,
  FaPinterestP,
  FaPodcast,
  FaReddit,
  FaSignalMessenger,
  FaSnapchat,
  FaSoundcloud,
  FaSpotify,
  FaTelegram,
  FaThreads,
  FaTiktok,
  FaTwitch,
  FaVimeoV,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6'

import { contactType, type ContactType } from '@/utilities/contactLink'

/** Redes reconocidas: si el nombre o la URL contiene una de estas palabras, se usa su ícono. */
export const socialNetworks: { Icon: React.ElementType; name: string; words: string[] }[] = [
  { name: 'Instagram', Icon: FaInstagram, words: ['instagram'] },
  { name: 'Facebook', Icon: FaFacebookF, words: ['facebook', 'fb.com', 'fb.me'] },
  { name: 'YouTube', Icon: FaYoutube, words: ['youtube', 'youtu.be'] },
  { name: 'WhatsApp', Icon: FaWhatsapp, words: ['whatsapp', 'wa.me'] },
  { name: 'TikTok', Icon: FaTiktok, words: ['tiktok'] },
  { name: 'Threads', Icon: FaThreads, words: ['threads'] },
  { name: 'LinkedIn', Icon: FaLinkedinIn, words: ['linkedin'] },
  { name: 'Telegram', Icon: FaTelegram, words: ['telegram', 't.me/'] },
  { name: 'Pinterest', Icon: FaPinterestP, words: ['pinterest', 'pin.it'] },
  { name: 'Spotify', Icon: FaSpotify, words: ['spotify'] },
  { name: 'SoundCloud', Icon: FaSoundcloud, words: ['soundcloud'] },
  { name: 'Pódcast', Icon: FaPodcast, words: ['podcast'] },
  { name: 'Vimeo', Icon: FaVimeoV, words: ['vimeo'] },
  { name: 'Twitch', Icon: FaTwitch, words: ['twitch'] },
  { name: 'Bluesky', Icon: FaBluesky, words: ['bluesky', 'bsky'] },
  { name: 'Snapchat', Icon: FaSnapchat, words: ['snapchat'] },
  { name: 'Flickr', Icon: FaFlickr, words: ['flickr'] },
  { name: 'Medium', Icon: FaMedium, words: ['medium.com', 'medium'] },
  { name: 'Discord', Icon: FaDiscord, words: ['discord'] },
  { name: 'Reddit', Icon: FaReddit, words: ['reddit'] },
  { name: 'Mastodon', Icon: FaMastodon, words: ['mastodon'] },
  { name: 'Signal', Icon: FaSignalMessenger, words: ['signal'] },
  { name: 'X', Icon: FaXTwitter, words: ['twitter', 'x.com', ' x '] },
]

const findNetwork = (name?: string | null, url?: string | null) => {
  const key = ` ${name || ''} ${url || ''} `.toLowerCase()
  return socialNetworks.find(({ words }) => words.some((w) => key.includes(w)))?.Icon
}

/** Elige el ícono de la red a partir de su nombre o su URL. Si no la reconoce, usa un globo terráqueo. */
export const SocialIcon: React.FC<{
  className?: string
  name?: string | null
  style?: React.CSSProperties
  url?: string | null
}> = ({ className, name, style, url }) => {
  const Icon = findNetwork(name, url) || Globe
  return React.createElement(Icon, { 'aria-hidden': true, className, style })
}

const contactIcons: Record<ContactType, React.ElementType> = {
  address: MapPin,
  contact: MessageCircle,
  email: Mail,
  link: Link2,
  phone: Phone,
  whatsapp: FaWhatsapp,
}

/** Ícono de una forma de contacto: el tipo elegido en el admin o, si no hay, el que se deduce del enlace. */
export const ContactIcon: React.FC<{
  className?: string
  href?: string | null
  label?: string | null
  style?: React.CSSProperties
  type?: ContactType | null
}> = ({ className, href, label, style, type }) => {
  const kind = contactType({ href, type })
  // Sin tipo elegido: si el enlace es de una red se usa su ícono; si no, el sobre de antes
  const network = !type && kind === 'link' ? findNetwork(label, href) : undefined
  const Icon = network || (!type && kind === 'link' ? Mail : contactIcons[kind])
  return React.createElement(Icon, { 'aria-hidden': true, className, style })
}
