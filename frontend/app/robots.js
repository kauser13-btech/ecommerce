export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.appleians.com';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/checkout/', '/my-orders/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
