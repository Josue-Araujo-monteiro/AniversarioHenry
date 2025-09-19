import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Convite Especial - Aniversário do Henry 🎉',
  description: 'Você está convidado para a festa de 1 ano do Henry! Confirme sua presença e veja todos os detalhes da festa.',
  keywords: 'aniversário, Henry, festa, convite, 1 ano, bebê',
  authors: [{ name: 'Jesa' }],
  openGraph: {
    title: 'Convite Especial - Aniversário do Henry 🎉',
    description: 'Você está convidado para a festa de 1 ano do Henry! Confirme sua presença e veja todos os detalhes da festa.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Aniversário do Henry',
    images: [
      {
        url: '/image/urso aviador  (1).png',
        width: 400,
        height: 400,
        alt: 'Urso aviador no avião - Henry',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Convite Especial - Aniversário do Henry 🎉',
    description: 'Você está convidado para a festa de 1 ano do Henry! Confirme sua presença e veja todos os detalhes da festa.',
    images: ['/image/urso aviador  (1).png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#F8FAF9" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
