import { Scale } from 'lucide-react'
import React from 'react'

import type { IntroBlock as IntroBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

// Colores de los paneles, uno por eje
const panels = [
  { panel: 'bg-corinto text-besh-suave', soft: 'bg-besh-suave/12', accent: 'text-ocre', dark: true },
  { panel: 'bg-besh-oscuro text-corinto-terciario', soft: 'bg-besh-suave/60', accent: 'text-fucsia', dark: false },
  { panel: 'bg-fucsia text-besh-suave', soft: 'bg-besh-suave/15', accent: 'text-besh-suave', dark: true },
  { panel: 'bg-corinto-terciario text-besh-suave', soft: 'bg-besh-suave/10', accent: 'text-ocre', dark: true },
]

/** Panel de color con la imagen saliendo del borde: se usa cuando una página tiene varias presentaciones. */
const IntroPanel: React.FC<IntroBlockProps & { position: number }> = ({
  body,
  facts,
  heading,
  highlight,
  image,
  kicker,
  position,
}) => {
  const list = Array.isArray(facts) ? facts : []
  const tone = panels[position % panels.length]!
  const flipped = position % 2 === 1

  return (
    <section className="container">
      <div
        className={cn(
          'relative rounded-[2.5rem] p-6 shadow-[0_-16px_48px_-24px_rgb(36_15_22/0.5)] sm:p-10 lg:flex lg:min-h-[47.5rem] lg:items-center lg:p-14',
          tone.panel,
        )}
        data-theme={tone.dark ? 'dark' : undefined}
      >
        <div className="relative grid w-full items-center gap-8 lg:grid-cols-12 lg:gap-12">
          <div className={cn('lg:col-span-7', flipped && 'lg:order-last')}>
            {kicker && <p className={cn('mb-3 text-step-small font-semibold', tone.accent)}>{kicker}</p>}
            <h2 className="text-step-head max-w-[18ch]">{heading}</h2>
            <p className="mt-5 text-step-body max-w-[52ch] whitespace-pre-line">{body}</p>

            {highlight && (
              <p className={cn('mt-6 flex items-center gap-3 rounded-2xl p-4 text-step-small font-medium', tone.soft)}>
                <Scale aria-hidden="true" className="size-5 shrink-0" />
                <span>{highlight}</span>
              </p>
            )}

            {list.length > 0 && (
              <dl className="mt-3 grid gap-3 sm:grid-cols-3">
                {list.map(({ id, label, value }) => (
                  <div className={cn('flex flex-col-reverse justify-end rounded-2xl p-4', tone.soft)} key={id}>
                    <dt className="mt-1 text-step-small opacity-90">{label}</dt>
                    <dd className="font-[family-name:var(--font-display)] text-step-head font-semibold leading-none">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          {image && typeof image === 'object' && (
            <figure
              className={cn(
                'relative mx-auto aspect-[4/5] w-full max-w-[24rem] overflow-hidden rounded-[2rem] bg-besh-oscuro shadow-[0_32px_64px_-24px_rgb(36_15_22/0.6)] ring-[6px] ring-besh-suave transition-transform duration-500 hover:rotate-0 lg:col-span-5 lg:-my-24 lg:max-w-none',
                flipped ? 'lg:rotate-2' : 'lg:-rotate-2',
              )}
            >
              <Media fill imgClassName="object-cover" resource={image} size="(max-width: 1024px) 100vw, 40vw" />
            </figure>
          )}
        </div>
      </div>
    </section>
  )
}

/** Presentación: el texto con las cifras en una fila y, a la derecha, la foto vertical. */
export const IntroBlock: React.FC<IntroBlockProps & { panelPosition?: number }> = ({
  panelPosition,
  ...props
}) => {
  if (panelPosition !== undefined) return <IntroPanel {...props} position={panelPosition} />

  const { body, facts, heading, highlight, image, kicker } = props
  const list = Array.isArray(facts) ? facts : []
  const hasImage = image && typeof image === 'object'
  const firstFact = list.find((f) => /^\d{4}$/.test(f.value))

  return (
    <section className="container">
      <div className={cn('grid items-center gap-12 lg:gap-16', hasImage && 'lg:grid-cols-12')}>
        {hasImage && (
          <figure className="relative lg:order-last lg:col-span-5" data-reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-besh-oscuro">
              <Media fill imgClassName="object-cover" resource={image} size="(max-width: 1024px) 100vw, 40vw" />
              <span aria-hidden="true" className="tejido absolute inset-x-0 bottom-0" />
            </div>
            {firstFact && (
              <figcaption className="absolute left-5 top-5 rounded-full bg-besh-suave/95 px-4 py-2 text-step-small font-medium text-corinto">
                Desde {firstFact.value}
              </figcaption>
            )}
          </figure>
        )}

        <div className={cn(hasImage ? 'lg:col-span-7' : 'max-w-[52rem]')}>
          <div data-reveal>
            {kicker && <p className="kicker mb-3">{kicker}</p>}
            <h2 className="text-step-head text-corinto max-w-[18ch]">{heading}</h2>
          </div>
          <p
            className="mt-6 text-step-lead max-w-[40ch] whitespace-pre-line"
            data-reveal
            style={{ '--i': 1 } as React.CSSProperties}
          >
            {body}
          </p>
          {highlight && (
            <p
              className="mt-8 flex items-center gap-4 text-step-body text-texto-secundario"
              data-reveal
              style={{ '--i': 2 } as React.CSSProperties}
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-fucsia/10 text-fucsia">
                <Scale aria-hidden="true" className="size-5" />
              </span>
              <span className="max-w-[40ch]">{highlight}</span>
            </p>
          )}

          {list.length > 0 && (
            <dl
              className="mt-12 grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3"
              data-reveal
              style={{ '--i': 3 } as React.CSSProperties}
            >
              {list.map(({ id, label, value }) => (
                <div className="flex flex-col-reverse justify-end border-s-2 border-ocre ps-5" key={id}>
                  <dt className="mt-2 text-step-small text-texto-secundario max-w-[20ch]">{label}</dt>
                  <dd className="font-[family-name:var(--font-display)] text-step-head font-semibold leading-none text-corinto">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </section>
  )
}
