import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Sans, IBM_Plex_Mono, IBM_Plex_Sans_Thai_Looped } from 'next/font/google';
import { site } from '@/shared/config/site';
import './globals.css';

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-plex-sans',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-mono',
  display: 'swap',
});

const plexThai = IBM_Plex_Sans_Thai_Looped({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-plex-thai',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${site.domain}`),
  title: {
    default: `${site.name} — ${site.taglineEn}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    'Thailang',
    'Thai programming language',
    'ภาษาโปรแกรมมิงไทย',
    'Rust compiler',
    'WebAssembly',
    'JavaScript transpiler',
  ],
  openGraph: {
    type: 'website',
    title: `${site.name} — ${site.taglineEn}`,
    description: site.description,
    siteName: site.name,
    locale: 'th_TH',
  },
  twitter: {
    card: 'summary_large_image',
    title: site.name,
    description: site.description,
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#fbf9f4',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="th"
      className={`${plexSans.variable} ${plexMono.variable} ${plexThai.variable}`}
    >
      <body className="min-h-screen paper-grain">{children}</body>
    </html>
  );
}
