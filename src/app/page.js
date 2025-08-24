'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Play, Star, Calendar, Search } from 'lucide-react'
import { movieApi } from '@/utils/api'
import MovieCard from '@/components/MovieCard'
import CategorySlider from '@/components/CategorySlider'
import LoadingSpinner from '@/components/LoadingSpinner'
import SearchResults from '@/components/SearchResults'
import { getBackdropUrl } from '@/utils/images'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [featuredMovies, setFeaturedMovies] = useState([])
  const [newReleases, setNewReleases] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [heroImage, setHeroImage] = useState('/images/placeholder-backdrop.jpg')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const [moviesData, newMoviesData] = await Promise.all([
          movieApi.getMovies({ 
            limit: 8, 
            ordering: 'rating', 
            direction: 'desc',
            page: 1
          }),
          movieApi.getMovies({ 
            limit: 8, 
            ordering: 'created', 
            direction: 'desc',
            page: 1
          })
        ])
        
        setFeaturedMovies(moviesData.data || [])
        setNewReleases(newMoviesData.data || [])
      } catch (error) {
        console.error('Error fetching data:', error)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (featuredMovies.length > 0) {
      setHeroImage(getBackdropUrl(featuredMovies[0]))
    }
  }, [featuredMovies])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Ошибка загрузки</h2>
          <p className="text-gray-400">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Search */}
      <section 
        className="relative h-96 bg-gradient-to-b from-gray-900 to-black mb-12"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        <div className="relative z-10 h-full flex items-center justify-center text-center">
          <div className="max-w-4xl mx-auto px-4 w-full">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Смотрите лучшие фильмы и сериалы
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Тысячи фильмов, сериалов и аниме в отличном качестве
            </p>
            
            {/* Поисковая строка */}
            <div className="relative max-w-2xl mx-auto mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск фильмов по названию, ID или Kinopoisk ID..."
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>
            
            <Link 
              href="/movies"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors inline-flex items-center"
            >
              <Play className="mr-2 h-5 w-5" />
              Смотреть сейчас
            </Link>
          </div>
        </div>
      </section>

      {/* Результаты поиска */}
      <SearchResults searchQuery={searchQuery} />

      {/* Основной контент (показывается только когда нет поискового запроса) */}
      {!searchQuery && (
        <>
          {/* Featured Movies */}
          <section className="container mx-auto px-4 mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold">Популярные фильмы</h2>
              <Link 
                href="/movies" 
                className="text-red-500 hover:text-red-400 transition-colors"
              >
                Смотреть все →
              </Link>
            </div>
            
            {featuredMovies.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                {featuredMovies.map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <MovieCard movie={movie} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">Популярные фильмы не найдены</p>
              </div>
            )}
          </section>

          {/* New Releases */}
          <section className="container mx-auto px-4 mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold">Новые поступления</h2>
              <Link 
                href="/movies?sort=new" 
                className="text-red-500 hover:text-red-400 transition-colors"
              >
                Смотреть все →
              </Link>
            </div>
            
            {newReleases.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                {newReleases.map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <MovieCard movie={movie} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">Новые фильмы не найдены</p>
              </div>
            )}
          </section>

          {/* Categories */}
          <section className="container mx-auto px-4 mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Категории</h2>
            <CategorySlider />
          </section>
        </>
      )}
    </div>
  )
}