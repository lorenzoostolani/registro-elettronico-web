import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Registro Voti',
  description: 'Web app voti Classeviva'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  )
}
