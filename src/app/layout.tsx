import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { getSiteSettings } from '@/lib/data';
import ThemeProvider from '@/components/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: {
      default: settings.siteTitle,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.siteDescription,
    keywords: settings.keywords,
    authors: [{ name: settings.siteName }],
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      url: 'https://exemplo.com',
      siteName: settings.siteName,
      title: settings.siteTitle,
      description: settings.siteDescription,
      images: [
        {
          url: settings.ogImageUrl || '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: settings.siteName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.siteTitle,
      description: settings.siteDescription,
      images: [settings.ogImageUrl || '/og-image.jpg'],
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: settings.faviconUrl
      ? {
          icon: settings.faviconUrl,
          shortcut: settings.faviconUrl,
          apple: settings.faviconUrl,
        }
      : undefined,
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  const colors = {
    colorPrimary: settings.colorPrimary,
    colorPrimaryLight: settings.colorPrimaryLight,
    colorAccent: settings.colorAccent,
    colorAccentLight: settings.colorAccentLight,
    colorAccentDark: settings.colorAccentDark,
  };

  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-primary text-neutral-50">
        <ThemeProvider colors={colors}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
