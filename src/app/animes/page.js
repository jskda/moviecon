'use client'

import { useState } from 'react'
// import { useSearchParams } from 'next/navigation'
import { Filter, Grid, List } from 'lucide-react'
import { useAnimes } from '@/hooks/useApi'
import MovieCard from '@/components/MovieCard'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function AnimesPage() {
  // const searchParams = useSearchParams()
  const [viewMode, setViewMode] = useState('grid')
  const [filters, setFilters] = useState({
    // ordering: searchParams.get('sort') || 'created',
    ordering: 'created',
    direction: 'desc',
    limit: 20,
    page: 1
  })

  const { data, isLoading } = useMovies({ 
    ...filters, 
    type: 'ANIME' 
  })

  if (isLoading) {
    return <LoadingSpinner />
  }

  const animes = data?.data || []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Аниме</h1>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700">
            <Filter className="h-5 w-5" />
          </button>
          
          <div className="flex bg-gray-800 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-accent' : 'hover:bg-gray-700'} rounded-l-lg`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-accent' : 'hover:bg-gray-700'} rounded-r-lg`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className={viewMode === 'grid' 
        ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4" 
        : "space-y-4"
      }>
        {animes.map((anime) => (
          <MovieCard key={anime.id} movie={anime} viewMode={viewMode} />
        ))}
      </div>

      {animes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">Аниме не найдены</p>
        </div>
      )}
    </div>
  )
}