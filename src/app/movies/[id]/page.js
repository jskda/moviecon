'use client'

import { useParams } from 'next/navigation'
import { useMovie } from '@/hooks/useApi'
import Player from '@/components/Player'
import LoadingSpinner from '@/components/LoadingSpinner'
import { getPosterUrl, getBackdropUrl } from '@/utils/images'
import { Star } from 'lucide-react'

export default function MovieDetailPage() {
  const params = useParams()
  const { data: movie, isLoading } = useMovie(params.id)

  const getYear = (dateString) => {
    if (!dateString) return 'Неизвестно'
    try {
      const date = new Date(dateString)
      return isNaN(date.getTime()) ? 'Неизвестно' : date.getFullYear().toString()
    } catch {
      return 'Неизвестно'
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Фильм не найден</h1>
      </div>
    )
  }

  console.log('Movie detail data:', movie)

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section with Backdrop */}
      <div 
        className="relative h-96 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${getBackdropUrl(movie)})`
        }}
      >
        <div className="container mx-auto px-4 pt-32">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            {movie.ru_title || movie.title}
          </h1>
          <p className="text-xl text-gray-300 mt-2">
            {movie.title && movie.title !== movie.ru_title ? movie.title : ''}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Плеер</h2>
              <Player 
                contentId={movie.id} 
                contentType="movie"
                translationId={movie.translations?.[0]?.id}
                iframeSrc={movie.iframe_src}
              />
            </div>

            <div className="bg-gray-800 rounded-lg p-6 mt-6">
              <h2 className="text-2xl font-bold mb-4">Описание</h2>
              <p className="text-gray-300">
                {movie.description || 'Описание фильма отсутствует.'}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Информация</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Год:</span>
                  <span>{getYear(movie.year || movie.released)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Рейтинг:</span>
                  <span className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    {movie.rating || '7.5'}/10
                  </span>
                </div>
                {movie.kinopoisk_id && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">КиноПоиск ID:</span>
                    <span>{movie.kinopoisk_id}</span>
                  </div>
                )}
                {movie.imdb_id && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">IMDb ID:</span>
                    <span>{movie.imdb_id}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Постер</h2>
              <img
                src={getPosterUrl(movie)}
                alt={movie.ru_title || movie.title}
                className="w-full rounded-lg"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x450/2d2d2d/ffffff?text=No+Image'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}