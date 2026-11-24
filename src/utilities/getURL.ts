import canUseDOM from './canUseDOM'

export const getServerSideURL = () => {
  return (
    process.env.NEXT_PUBLIC_SERVER_URL ||
    // En producción siempre el dominio final, no el de Vercel (VERCEL_PROJECT_PRODUCTION_URL)
    (process.env.VERCEL_ENV === 'production'
      ? 'https://alianzaammi.org'
      : process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : 'http://localhost:3000')
  )
}

export const getClientSideURL = () => {
  if (canUseDOM) {
    const protocol = window.location.protocol
    const domain = window.location.hostname
    const port = window.location.port

    return `${protocol}//${domain}${port ? `:${port}` : ''}`
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  return process.env.NEXT_PUBLIC_SERVER_URL || ''
}
