'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Filter, Grid, List } from 'lucide-react'
import { useTvSeries } from '@/hooks/useApi'
import MovieCard from '@/components/MovieCard'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function TvSeriesPage() {
  const searchParams = useSearchParams()
  const [viewMode, setViewMode] = useState('grid')
  const [filters, setFilters] = useState({
    ordering: searchParams.get('sort') || 'created',
    direction: 'desc',
    limit: 20,
    page: 1
  })

  const { data, isLoading } = useTvSeries(filters)

  if (isLoading) {
    return <LoadingSpinner />
  }

  const tvSeries = data?.data || []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Сериалы</h1>
        
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
        {tvSeries.map((series) => (
          <MovieCard key={series.id} movie={series} viewMode={viewMode} />
        ))}
      </div>

      {tvSeries.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">Сериалы не найдены</p>
        </div>
      )}
    </div>
  )
}