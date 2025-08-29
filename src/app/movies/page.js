'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Filter, Grid, List } from 'lucide-react'
import { useMovies } from '@/hooks/useApi'
import MovieCard from '@/components/MovieCard'
import LoadingSpinner from '@/components/LoadingSpinner'

function MoviesContent() {
  const searchParams = useSearchParams()
  const [viewMode, setViewMode] = useState('grid')
  const [filters, setFilters] = useState({
    ordering: searchParams.get('sort') || 'created',
    direction: 'desc',
    limit: 20,
    page: 1
  })

  const { data, isLoading, error } = useMovies(filters)

  if (isLoading) {
    return <LoadingSpinner />
  }

  const movies = data?.data || []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Фильмы</h1>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700">
            <Filter className="h-5 w-5" />
          </button>
          
          <div className="flex bg-gray-800 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-red-600' : 'hover:bg-gray-700'} rounded-l-lg`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-red-600' : 'hover:bg-gray-700'} rounded-r-lg`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {movies.length > 0 ? (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4" 
          : "space-y-4"
        }>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} viewMode={viewMode} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">Фильмы не найдены</p>
          {error && (
            <p className="text-red-400 text-sm mt-2">
              Ошибка: {error.message}
            </p>
          )}
          <p className="text-gray-500 text-sm mt-2">
            Проверьте подключение к API или настройки фильтров
          </p>
        </div>
      )}
    </div>
  )
}

export default function MoviesPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <MoviesContent />
    </Suspense>
  )
}