import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { MayaDate } from '@/components/MayaDate'

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []
  const contacts = footerData?.contacts || []
  const socialLinks = footerData?.socialLinks || []

  return (
    <footer className="mt-auto bg-corinto-terciario text-besh-suave" data-theme="dark">
      <span aria-hidden="true" className="tejido" />
      <div className="container pt-20 md:pt-28 pb-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <Link aria-label="Ir al inicio" className="block lg:col-span-6" href="/">
            <Logo className="w-full max-w-[38rem]" tone="white" variant="full" />
          </Link>
          {footerData?.statement && (
            <p className="lg:col-span-5 lg:col-start-8 text-step-lead text-besh-fuerte max-w-[30ch]">
              {footerData.statement}
            </p>
          )}
        </div>

        <div className="mt-20 md:mt-28 grid gap-12 lg:grid-cols-12">
          {contacts.length > 0 && (
            <ul className="lg:col-span-5 flex flex-col gap-2">
              {contacts.map(({ href, label, id }) => (
                <li className="text-step-title" key={id}>
                  {href ? (
                    <a
                      className="text-ocre underline-offset-[6px] decoration-2 hover:underline break-words"
                      href={href}
                    >
                      {label}
                    </a>
                  ) : (
                    <span className="text-ocre">{label}</span>
                  )}
                </li>
              ))}
            </ul>
          )}

          <div className="lg:col-span-6 lg:col-start-7 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
            {navItems.length > 0 && (
              <nav aria-label="Sitio" className="flex flex-col gap-3 sm:col-span-2 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:content-start">
                {navItems.map(({ link }, i) => (
                  <CMSLink
                    className="text-step-body text-besh-suave underline-offset-4 hover:text-ocre hover:underline"
                    key={i}
                    {...link}
                  />
                ))}
              </nav>
            )}
            {socialLinks.length > 0 && (
              <ul className="flex flex-col gap-3">
                {socialLinks.map(({ label, url, id }) => (
                  <li key={id}>
                    <a
                      className="text-step-body text-besh-suave underline-offset-4 hover:text-ocre hover:underline"
                      href={url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-24 flex flex-col gap-4 text-step-small text-besh-oscuro md:flex-row md:items-baseline md:justify-between">
          <div className="flex flex-col gap-1">
            <MayaDate />
            {footerData?.legal && <p>{footerData.legal}</p>}
          </div>
          <a className="text-besh-suave underline-offset-4 hover:underline" href="#top">
            Volver arriba
          </a>
        </div>
      </div>
    </footer>
  )
}
