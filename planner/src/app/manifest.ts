import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Becoming — The Content Planner',
    short_name: 'Becoming',
    description: 'Little by little, an Instagram studio for Rooted With Ally.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFEFB',
    theme_color: '#3C2A1C',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
