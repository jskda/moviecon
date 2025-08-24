'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Search, Film, X } from 'lucide-react'
import SearchBar from './SearchBar'

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full bg-gray-900 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Film className="h-8 w-8 text-red-600" />
            <span className="text-xl font-bold">MovieCon</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/movies" className="hover:text-red-500 transition-colors">
              Фильмы
            </Link>
            <Link href="/tv-series" className="hover:text-red-500 transition-colors">
              Сериалы
            </Link>
            <Link href="/animes" className="hover:text-red-500 transition-colors">
              Аниме
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:text-red-500 transition-colors"
            >
              {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isSearchOpen && (
          <div className="mt-4">
            <SearchBar onClose={() => setIsSearchOpen(false)} />
          </div>
        )}
      </div>
    </header>
  )
}