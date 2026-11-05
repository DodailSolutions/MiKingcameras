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
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/favicon-200x200.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  };
}
