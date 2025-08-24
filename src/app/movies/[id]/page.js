'use client'

import { useParams } from 'next/navigation'
import { useMovie } from '@/hooks/useApi'
import Player from '@/components/Player'
import LoadingSpinner from '@/components/LoadingSpinner'
import { getPosterUrl, getBackdropUrl } from '@/utils/images'

export default function MovieDetailPage() {
  const params = useParams()
  const { data: movie, isLoading, error } = useMovie(params.id)

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

  console.log('Movie data for player:', {
    requested_id: params.id,
    found_id: movie?.id,
    title: movie?.ru_title,
    kinopoisk_id: movie?.kinopoisk_id,
    imdb_id: movie?.imdb_id,
  })

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
            {movie?.ru_title || movie?.title || 'Неизвестный фильм'}
          </h1>
          <p className="text-xl text-gray-300 mt-2">
            {movie?.title && movie.title !== movie.ru_title ? movie.title : ''}
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
              />
            </div>

            <div className="bg-gray-800 rounded-lg p-6 mt-6">
              <h2 className="text-2xl font-bold mb-4">Описание</h2>
              <p className="text-gray-300">
                {movie?.description || 'Описание фильма отсутствует.'}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Информация</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">ID в системе:</span>
                  <span>{movie?.id || 'Неизвестно'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Год:</span>
                  <span>{getYear(movie?.year || movie?.released)}</span>
                </div>
                {movie?.kinopoisk_id && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">КиноПоиск ID:</span>
                    <span>{movie.kinopoisk_id}</span>
                  </div>
                )}
                {movie?.imdb_id && (
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
                alt={movie?.ru_title || movie?.title || 'Movie'}
                className="w-full rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}