'use client'

import { useSearchMovies } from '@/hooks/useApi'
import MovieCard from './MovieCard'
import LoadingSpinner from './LoadingSpinner'

export default function SearchResults({ searchQuery }) {
  const { data, isLoading, error } = useSearchMovies(searchQuery)
  
  if (!searchQuery || searchQuery.length < 2) {
    return null
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 text-center py-8">
        <p className="text-red-400">Ошибка поиска: {error.message}</p>
      </div>
    )
  }

  const movies = data?.data || []

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">
        Результаты поиска: "{searchQuery}"
      </h2>
      
      {movies.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400">По запросу "{searchQuery}" ничего не найдено</p>
          <p className="text-gray-500 text-sm mt-2">
            Попробуйте использовать название фильма, ID или Kinopoisk ID
          </p>
        </div>
      )}
    </div>
  )
}