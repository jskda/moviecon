'use client'

import Link from 'next/link'
import { Film, Tv, Clapperboard, Sparkles } from 'lucide-react'

const categories = [
  {
    id: 'movies',
    name: 'Фильмы',
    icon: Film,
    href: '/movies',
    count: '10K+'
  },
  {
    id: 'tv-series',
    name: 'Сериалы',
    icon: Tv,
    href: '/tv-series',
    count: '5K+'
  },
  {
    id: 'animes',
    name: 'Аниме',
    icon: Clapperboard,
    href: '/animes',
    count: '2K+'
  },
  {
    id: 'new',
    name: 'Новинки',
    icon: Sparkles,
    href: '/movies?sort=new',
    count: '500+'
  }
]

export default function CategorySlider() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((category) => {
        const Icon = category.icon
        return (
          <Link
            key={category.id}
            href={category.href}
            className="bg-gray-800 p-6 rounded-lg hover:bg-accent transition-colors group"
          >
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <Icon className="h-8 w-8 text-accent group-hover:text-white" />
              </div>
              <h3 className="font-semibold mb-1 group-hover:text-white">{category.name}</h3>
              <p className="text-sm text-gray-400 group-hover:text-gray-200">{category.count}</p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}