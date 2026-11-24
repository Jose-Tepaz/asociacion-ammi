// Dominio final del sitio. Si NEXT_PUBLIC_SERVER_URL no está definida, el sitemap y el robots
// no deben quedarse con el dominio de Vercel ni sin «https://».
const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://alianzaammi.org'

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  exclude: ['/posts-sitemap.xml', '/pages-sitemap.xml', '/*', '/posts/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: '/admin/*',
      },
    ],
    additionalSitemaps: [`${SITE_URL}/pages-sitemap.xml`, `${SITE_URL}/posts-sitemap.xml`],
  },
}
