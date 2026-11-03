/** @type {import('tailwindcss').Config} */
const config = {
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: [
            {
              '--tw-prose-body': 'var(--foreground)',
              '--tw-prose-headings': 'var(--foreground)',
              '--tw-prose-links': 'var(--corinto-primario)',
              '--tw-prose-bold': 'var(--foreground)',
              '--tw-prose-quotes': 'var(--corinto-primario)',
              '--tw-prose-quote-borders': 'var(--fucsia-primario)',
              '--tw-prose-bullets': 'var(--fucsia-primario)',
              '--tw-prose-counters': 'var(--corinto-primario)',
              '--tw-prose-hr': 'var(--besh-oscuro)',
              '--tw-prose-captions': 'var(--muted-foreground)',
              '--tw-prose-invert-body': 'var(--besh-suave)',
              '--tw-prose-invert-headings': 'var(--besh-suave)',
              '--tw-prose-invert-links': 'var(--ocre-primario)',
              fontSize: 'var(--step-body)',
              lineHeight: '1.6',
              maxWidth: '68ch',
              a: {
                textDecorationThickness: '2px',
                textUnderlineOffset: '4px',
              },
              'h1, h2, h3, h4': {
                fontFamily: 'var(--font-display)',
                fontWeight: '600',
                letterSpacing: '-0.02em',
              },
              h1: {
                fontSize: 'var(--step-head)',
                lineHeight: '0.95',
                marginBottom: '0.4em',
              },
              h2: {
                fontSize: 'clamp(1.75rem, 1.2rem + 2vw, 2.75rem)',
                lineHeight: '1.05',
                marginTop: '1.6em',
                marginBottom: '0.6em',
              },
              h3: {
                fontSize: 'var(--step-lead)',
                lineHeight: '1.2',
              },
              blockquote: {
                fontStyle: 'normal',
                fontWeight: '400',
                fontSize: 'var(--step-lead)',
              },
            },
          ],
        },
      },
    },
  },
}

export default config
