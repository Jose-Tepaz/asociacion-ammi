import { Facebook, Globe, Instagram, Twitter, Youtube } from 'lucide-react'
import React from 'react'

/** Elige el ícono de la red a partir de su nombre o su URL. */
export const SocialIcon: React.FC<{ className?: string; name: string; url?: string }> = ({
  className,
  name,
  url = '',
}) => {
  const key = `${name} ${url}`.toLowerCase()
  const Icon = key.includes('instagram')
    ? Instagram
    : key.includes('facebook')
      ? Facebook
      : key.includes('youtube')
        ? Youtube
        : key.includes('twitter') || key.includes('x.com')
          ? Twitter
          : Globe
  return <Icon aria-hidden="true" className={className} />
}
