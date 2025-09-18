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
        url: '/image/leoPrincipal.png',
        width: 400,
        height: 400,
        alt: 'Leão piloto no avião - Henry',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Convite Especial - Aniversário do Henry 🎉',
    description: 'Você está convidado para a festa de 1 ano do Henry! Confirme sua presença e veja todos os detalhes da festa.',
    images: ['/image/leoPrincipal.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
