import type { Metadata } from 'next';
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
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable} ${archivoBlack.variable}`}>
      <body>{children}</body>
    </html>
  );
}
