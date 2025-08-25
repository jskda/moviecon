'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Play, Star, Calendar } from 'lucide-react'
import { useMovies } from '@/hooks/useApi'
import MovieCard from '@/components/MovieCard'
import CategorySlider from '@/components/CategorySlider'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function Home() {
  const { data: featuredData, isLoading: featuredLoading, error: featuredError } = useMovies({ 
    limit: 8, 
    ordering: 'rating', 
    direction: 'desc' 
  })
  
  const { data: newReleasesData, isLoading: newReleasesLoading, error: newReleasesError } = useMovies({ 
    limit: 8, 
    ordering: 'created', 
    direction: 'desc' 
  })

  const [heroImage, setHeroImage] = useState('/images/placeholder-backdrop.jpg')

  useEffect(() => {
    if (featuredData?.data?.[0]) {
      setHeroImage(featuredData.data[0].poster || '/images/placeholder-backdrop.jpg')
    }
  }, [featuredData])

  const isLoading = featuredLoading || newReleasesLoading

  if (isLoading) {
    return <LoadingSpinner />
  }

  const featuredMovies = featuredData?.data || []
  const newReleases = newReleasesData?.data || []

  console.log('Home page data - featured:', featuredData)
  console.log('Home page data - new releases:', newReleasesData)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
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
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Смотрите лучшие фильмы и сериалы
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Тысячи фильмов, сериалов и аниме в отличном качестве
            </p>
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
            <p className="text-gray-400 text-lg">Фильмы не найдены</p>
            {featuredError && (
              <p className="text-red-400 text-sm mt-2">
                Ошибка загрузки: {featuredError.message}
              </p>
            )}
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
            {newReleasesError && (
              <p className="text-red-400 text-sm mt-2">
                Ошибка загрузки: {newReleasesError.message}
              </p>
            )}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Категории</h2>
        <CategorySlider />
      </section>
    </div>
  )
}