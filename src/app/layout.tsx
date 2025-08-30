// src/app/layout.tsx - Root layout with global styles and providers
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import "../styles/globals.css"
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Green Hydrogen Subsidy Platform',
  description: 'Blockchain-powered green hydrogen project funding and verification platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  )
}