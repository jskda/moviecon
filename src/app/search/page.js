'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { movieApi } from '@/utils/api'
import MovieCard from '@/components/MovieCard'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (query) {
      setIsLoading(true)
      movieApi.searchMovies(query)
        .then(data => {
          setResults(data.data || [])
        })
        .catch(error => {
          console.error('Search error:', error)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [query])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Результаты поиска</h1>
        {query && (
          <p className="text-gray-400">
            По запросу: <span className="text-accent">"{query}"</span>
          </p>
        )}
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {results.map((item) => (
            <MovieCard key={item.id} movie={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">
            {query ? 'Ничего не найдено' : 'Введите поисковый запрос'}
          </p>
        </div>
      )}
    </div>
  )
}