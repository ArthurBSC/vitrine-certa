import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vitrine Certa',
  description: 'Vitrine Certa: selecao independente de produtos com ofertas em marketplaces parceiros.',
  icons: {
    icon: '/favicon-vitrine-certa.svg',
    shortcut: '/favicon-vitrine-certa.svg',
    apple: '/logo-vitrine-certa.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
