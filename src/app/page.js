'use client'

import { useMovies } from '@/hooks/useApi'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import MovieCard from '@/components/MovieCard'
import CategorySlider from '@/components/CategorySlider'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function Home() {
  const { data: featuredData, isLoading: featuredLoading, error: featuredError } = useMovies({ 
    limit: 12, 
    ordering: 'rating', 
    direction: 'desc' 
  })
  const { data: newReleasesData, isLoading: newReleasesLoading, error: newReleasesError } = useMovies({ 
    limit: 12, 
    ordering: 'created', 
    direction: 'desc' 
  })

  const isLoading = featuredLoading || newReleasesLoading
  const hasError = featuredError || newReleasesError

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Ошибка базы данных</h1>
          <p className="text-gray-400">Проверьте подключение</p>
        </div>
      </div>
    )
  }

  const featuredMovies = featuredData?.data || []
  const newReleases = newReleasesData?.data || []

  return (
    <div className="min-h-screen relative">
      <div className="relative z-10 bg-transparent">
        {/* Hero Section */}
        <section className="relative h-96 mb-15">
          <div className="relative z-10 h-full flex items-center justify-center text-center">
            <div className="max-w-4xl mx-auto px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
                Лучшие фильмы и сериалы
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-200">
                Тысячи фильмов, сериалов и аниме в отличном качестве
              </p>
              <Link 
                href="/movies"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors inline-flex items-center"
              >
                <Play className="mr-2 h-5 w-5" />
                Смотреть коллекцию
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Movies */}
        <section className="container mx-auto px-4 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Популярные фильмы</h2>
            <Link 
              href="/movies?sort=rating" 
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
              <p className="text-gray-500 text-sm mt-2">
                База данных пустая. Запустите синхронизацию.
              </p>
            </div>
          )}
        </section>

        {/* New Releases */}
        <section className="container mx-auto px-4 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Новые поступления</h2>
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
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">Категории</h2>
          <CategorySlider />
        </section>
      </div>
    </div>
  )
}