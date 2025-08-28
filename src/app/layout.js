'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import './globals.css'

const queryClient = new QueryClient()

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <title>MovieCon - Фильмы и сериалы</title>
        <meta name="description" content="Смотрите лучшие фильмы и сериалы" />
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body className="bg-black text-white">
        <QueryClientProvider client={queryClient}>
          <Header />
          <main className="min-h-screen pt-16">
            {children}
          </main>
          <Footer />
        </QueryClientProvider>
      </body>
    </html>
  )
}