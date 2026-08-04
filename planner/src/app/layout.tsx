import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Poppins, Archivo_Black } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700'],
});

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const archivoBlack = Archivo_Black({
  variable: '--font-archivo',
  subsets: ['latin'],
  weight: '400',
});

export const metadata: Metadata = {
  title: 'Becoming — The Content Planner | Rooted With Ally',
  description: 'Little by little, an Instagram studio for Rooted With Ally.',
  icons: {
    icon: [
      { url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Becoming',
  },
};

export const viewport: Viewport = {
  themeColor: '#3C2A1C',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable} ${archivoBlack.variable}`}>
      <body>{children}</body>
    </html>
  );
}
