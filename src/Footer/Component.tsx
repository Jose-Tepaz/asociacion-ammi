import { getCachedGlobal } from '@/utilities/getGlobals'
import { ArrowUp } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { SocialIcon } from '@/components/SocialIcon'
import { getMediaUrl } from '@/utilities/getMediaUrl'

const columnTitle = 'font-sans text-step-body font-medium tracking-normal text-ocre'
const columnLink = 'text-step-body text-besh-suave/85 underline-offset-4 transition-colors hover:text-besh-suave hover:underline'

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []
  const contacts = footerData?.contacts || []
  const socialLinks = footerData?.socialLinks || []
  const logo = footerData?.logo && typeof footerData.logo === 'object' ? footerData.logo : null

  return (
    <footer className="mt-auto bg-corinto-secundario text-besh-suave" data-theme="dark">
      <span aria-hidden="true" className="tejido" />
      <div className="container grid gap-12 py-[var(--section-y)] sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        <div className="sm:col-span-2 lg:col-span-5">
          <Link aria-label="Ir al inicio" className="inline-block" href="/">
            {logo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                alt={logo.alt || 'AMMI'}
                className="block h-auto max-h-32 w-auto max-w-[13rem] object-contain md:max-w-[15rem]"
                src={getMediaUrl(logo.url, logo.updatedAt)}
              />
            ) : (
              <Logo className="w-[13rem] md:w-[15rem]" tone="white" variant="full" />
            )}
          </Link>
          {footerData?.statement && (
            <p className="mt-6 text-step-body text-besh-fuerte max-w-[34ch]">{footerData.statement}</p>
          )}
        </div>

        {navItems.length > 0 && (
          <nav aria-labelledby="pie-navegacion" className="lg:col-span-3 lg:col-start-7">
            <h2 className={columnTitle} id="pie-navegacion">
              Navegación
            </h2>
            <ul className="mt-5 flex flex-col gap-3">
              {navItems.map(({ link }, i) => (
                <li key={i}>
                  <CMSLink className={columnLink} {...link} />
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="flex flex-col gap-10 lg:col-span-3 lg:col-start-10">
          <div>
            <h2 className={columnTitle}>Contáctanos</h2>
            {contacts.length > 0 && (
              <ul className="mt-5 flex flex-col gap-3">
                {contacts.map(({ href, label, id }) => (
                  <li key={id}>
                    {href ? (
                      <a className={`${columnLink} break-words`} href={href}>
                        {label}
                      </a>
                    ) : (
                      <span className="text-step-body text-besh-suave/85">{label}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {socialLinks.length > 0 && (
            <div>
              <h2 className={columnTitle}>Síguenos</h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {socialLinks.map(({ label, url, id }) => (
                  <li key={id}>
                    <a
                      aria-label={label}
                      className="grid size-10 place-items-center rounded-full bg-besh-suave/10 transition-colors hover:bg-ocre hover:text-texto-primario"
                      href={url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <SocialIcon className="size-4" name={label} url={url} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-besh-suave/10">
        <div className="container flex flex-col gap-3 py-6 text-step-small text-besh-oscuro md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} AMMI.{footerData?.legal ? ` ${footerData.legal}` : ''}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <p className="text-step-small opacity-80">
              Glifos mayas:{' '}
              <a
                className="underline underline-offset-2 hover:text-besh-suave"
                href="https://commons.wikimedia.org/wiki/User:Bluebalam"
                rel="noopener noreferrer"
                target="_blank"
              >
                Bluebalam
              </a>
              ,{' '}
              <a
                className="underline underline-offset-2 hover:text-besh-suave"
                href="https://creativecommons.org/licenses/by-sa/4.0/deed.es"
                rel="noopener noreferrer"
                target="_blank"
              >
                CC BY-SA 4.0
              </a>
            </p>
            <a className="inline-flex items-center gap-1.5 text-besh-suave underline-offset-4 hover:underline" href="#top">
              Volver arriba
              <ArrowUp aria-hidden="true" className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
