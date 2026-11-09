import { ArrowUpRight, MapPin } from 'lucide-react'
import React from 'react'

import type { Page } from '@/payload-types'

import { CalendarTile } from '@/components/MayaDate/CalendarTile'
import RichText from '@/components/RichText'
import { ContactIcon, SocialIcon } from '@/components/SocialIcon'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { cn } from '@/utilities/ui'

import { HeroLinks, heroTitleClasses } from '../HeroLinks'

type LowImpactHeroType =
  | {
      aside?: never
      children?: React.ReactNode
      richText?: never
      standfirst?: never
      links?: never
      kicker?: never
      tone?: never
    }
  | (Omit<Page['hero'], 'richText'> & {
      aside?: React.ReactNode
      children?: never
      richText?: Page['hero']['richText']
    })

const titleSize = '[&_h1]:leading-[1.02]'

const Kicker: React.FC<{ className?: string; dot: string; text: string }> = ({ className, dot, text }) => (
  <p className={cn('fade-up mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-step-small font-medium', className)}>
    <span aria-hidden="true" className={cn('size-1.5 rounded-full', dot)} />
    {text}
  </p>
)

const isWhatsApp = (href?: string | null) => /wa\.me|whatsapp/i.test(href || '')

/** Orden de la tarjeta: correo, dirección y WhatsApp. */
const contactOrder = (href?: string | null) => (isWhatsApp(href) ? 2 : href ? 0 : 1)

/** Correo, dirección, WhatsApp y redes, tomados del pie de página. El teléfono solo va en el pie. */
const ContactCard = async () => {
  const footer = await getCachedGlobal('footer', 1)()
  const contacts = (footer?.contacts || [])
    .filter(({ href }) => !href?.startsWith('tel:'))
    .sort((a, b) => contactOrder(a.href) - contactOrder(b.href))
  const social = footer?.socialLinks || []

  return (
    <div className="fade-up w-full max-w-[28rem] rounded-[2rem] bg-background p-6 ring-1 ring-texto-primario/8 md:p-8">
      <p className="text-step-small font-medium text-fucsia">Otras formas de encontrarnos</p>
      <ul className="mt-5 flex flex-col gap-4">
        {contacts.map(({ href, id, label }) => {
          const body = (
            <>
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-corinto text-besh-suave">
                {href ? (
                  <ContactIcon className="size-5" href={href} />
                ) : (
                  <MapPin aria-hidden="true" className="size-5" />
                )}
              </span>
              <span className="text-step-body font-medium">{label}</span>
            </>
          )
          return (
            <li key={id}>
              {href ? (
                <a
                  className="group flex items-center gap-4 underline-offset-4 hover:underline"
                  href={href}
                  {...(href.startsWith('http') ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
                >
                  {body}
                  <ArrowUpRight aria-hidden="true" className="ms-auto size-4 text-corinto opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              ) : (
                <div className="flex items-center gap-4">{body}</div>
              )}
            </li>
          )
        })}
      </ul>
      {social.length > 0 && (
        <div className="mt-6 border-t border-besh-oscuro pt-6">
          <p className="text-step-small text-texto-secundario">Síguenos</p>
          <ul className="mt-3 flex gap-2">
            {social.map(({ id, label, url }) => (
              <li key={id}>
                <a
                  aria-label={label}
                  className="grid size-11 place-items-center rounded-full bg-besh-fuerte text-corinto transition-colors hover:bg-corinto hover:text-besh-suave"
                  href={url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <SocialIcon className="size-5" name={label} url={url} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

/**
 * Encabezado de las páginas internas, con tres diseños distintos:
 * banda corinto, calendario con el día de hoy, o contacto con los datos de la Alianza.
 */
export const LowImpactHero: React.FC<LowImpactHeroType> = ({
  aside,
  children,
  kicker,
  links,
  richText,
  standfirst,
  tone,
}) => {
  const title = children || (richText && <RichText data={richText} enableGutter={false} enableProse={false} />)

  if (tone === 'contacto') {
    return (
      <section className="overflow-hidden bg-besh-fuerte" data-hero="beige">
        <div className="container grid items-stretch gap-8 py-[var(--section-y)] md:grid-cols-12 md:gap-10 lg:grid-rows-[auto_1fr] lg:gap-y-8">
          <div className="md:col-span-6">
            {kicker && <Kicker className="bg-corinto/10 text-fucsia" dot="bg-fucsia" text={kicker} />}
            <div className="mask-line">
              <div className={cn(heroTitleClasses, titleSize, '[&_h1]:max-w-[16ch] [&_h1]:text-corinto')}>{title}</div>
            </div>
            {standfirst && <p className="fade-up mt-4 md:mt-6 lg:mt-4 text-step-lead max-w-[40ch]">{standfirst}</p>}
            {links && <HeroLinks className="fade-up mt-6 md:mt-8" links={links} />}
          </div>
          <div className="md:col-span-6 lg:col-start-1">
            <ContactCard />
          </div>
          {aside && (
            <div className="flex flex-col md:col-span-12 lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1">
              {aside}
            </div>
          )}
        </div>
      </section>
    )
  }

  if (tone === 'calendario') {
    return (
      <section className="overflow-hidden bg-besh-fuerte" data-hero="beige">
        <div className="container grid items-center gap-12 py-[var(--section-y)] md:grid-cols-12 md:gap-8 lg:gap-10">
          <div className="md:col-span-6 lg:col-span-7">
            {kicker && <Kicker className="bg-corinto/10 text-fucsia" dot="bg-fucsia" text={kicker} />}
            <div className="mask-line">
              <div className={cn(heroTitleClasses, titleSize, '[&_h1]:max-w-[16ch] [&_h1]:text-corinto')}>{title}</div>
            </div>
            {standfirst && <p className="fade-up mt-4 md:mt-6 lg:mt-4 text-step-lead max-w-[40ch]">{standfirst}</p>}
            {links && <HeroLinks className="fade-up mt-6 md:mt-8" links={links} />}
          </div>
          <div className="flex justify-center md:col-span-6 md:justify-end lg:col-span-5">
            <CalendarTile />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden bg-corinto-secundario text-besh-suave" data-hero="dark" data-theme="dark">
      {/* El glifo de AMMI como marca de agua, cortado por el borde */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 top-1/2 hidden w-[44rem] max-w-none -translate-y-1/2 opacity-[0.08] md:block"
        src="/brand/ammi-mark-white.png"
      />
      <div className="container relative py-[var(--section-y)]">
        {kicker && <Kicker className="bg-besh-suave/10 text-ocre" dot="bg-ocre" text={kicker} />}
        <div className="mask-line">
          <div className={cn(heroTitleClasses, titleSize, '[&_h1]:max-w-[22ch]')}>{title}</div>
        </div>
        {standfirst && <p className="fade-up mt-4 md:mt-6 lg:mt-4 text-step-lead text-besh-fuerte max-w-[46ch]">{standfirst}</p>}
        {links && <HeroLinks className="fade-up mt-6 md:mt-8" links={links} onDark />}
      </div>
      <span aria-hidden="true" className="tejido relative" />
    </section>
  )
}
