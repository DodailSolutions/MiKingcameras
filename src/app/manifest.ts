import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mi King's DSLR Camera Shop",
    short_name: "Mi King's",
    description: "Hyderabad's Premier Destination for DSLR, Mirrorless Cameras & Cinema Equipment",
    start_url: '/',
    display: 'standalone',
    background_color: '#0c0b09',
    theme_color: '#F5821F',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
