import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Lunark AI - Making Blockchain Human-Friendly',
    short_name: 'Lunark AI',
    description: 'Making blockchain human-friendly with Lunark Agent. Interact with the blockchain using natural language.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/images/favicon.png',
        sizes: 'any',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    categories: ['finance', 'blockchain', 'ai'],
    lang: 'en-US',
    dir: 'ltr',
  }
}
