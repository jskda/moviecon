'use client'

import Link from 'next/link'
import { Play, Star, Calendar } from 'lucide-react'
import { getPosterUrl } from '@/utils/images'

export default function MovieCard({ movie, viewMode = 'grid' }) {
  const posterUrl = getPosterUrl(movie)

  const getYear = (dateString) => {
    if (!dateString) return 'Неизвестно'
    try {
      const date = new Date(dateString)
      return isNaN(date.getTime()) ? 'Неизвестно' : date.getFullYear().toString()
    } catch {
      return 'Неизвестно'
    }
  }

  const getRating = () => {
    // Если в API есть рейтинг - используем его, иначе заглушку
    return movie.rating ? movie.rating.toFixed(1) : '7.5'
  }

  if (viewMode === 'list') {
    return (
      <Link href={`/${movie.type || 'movies'}/${movie.id}`} className="group">
        <div className="flex bg-gray-800 rounded-lg overflow-hidden transition-transform group-hover:scale-105 group-hover:shadow-2xl">
          <div className="relative w-24 h-36 flex-shrink-0">
            <img
              src={posterUrl}
              alt={movie.ru_title || movie.title || 'Movie'}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="p-4 flex-1">
            <h3 className="font-semibold mb-2 line-clamp-2">
              {movie.ru_title || movie.title || 'Без названия'}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{getYear(movie.year || movie.released)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 text-yellow-400" />
                <span>{getRating()}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/${movie.type || 'movies'}/${movie.id}`} className="group">
      <div className="bg-gray-800 rounded-lg overflow-hidden transition-transform group-hover:scale-105 group-hover:shadow-2xl">
        <div className="relative aspect-[2/3]">
          <img
            src={posterUrl}
            alt={movie.ru_title || movie.title || 'Movie'}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Play className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
        
        <div className="p-3">
          <h3 className="font-semibold text-sm mb-2 line-clamp-2">
            {movie.ru_title || movie.title || 'Без названия'}
          </h3>
          
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{getYear(movie.year || movie.released)}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 text-yellow-400" />
              <span>{getRating()}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}