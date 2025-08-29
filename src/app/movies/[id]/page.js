'use client'

import { useParams } from 'next/navigation'
import { useMovie } from '@/hooks/useApi'
import Player from '@/components/Player'
import LoadingSpinner from '@/components/LoadingSpinner'
import { getPosterUrl, getBackdropUrl } from '@/utils/images'
import { Star, Calendar } from 'lucide-react'
import Image from 'next/image'

export default function ContentDetailPage() {
  const params = useParams()
  const { data: content, isLoading } = useMovie(params.id)

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

  if (!content) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Контент не найден</h1>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div 
        className="relative h-96 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${getBackdropUrl(content)})`
        }}
      >
        <div className="container mx-auto px-4 pt-32">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            {content.ru_title || content.title}
          </h1>
          <p className="text-xl text-gray-300 mt-2">
            {content.title && content.title !== content.ru_title ? content.title : ''}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Плеер</h2>
              <Player 
                contentId={content.id} 
                contentType={content.type?.toLowerCase() || 'movie'}
                iframeSrc={content.iframe_src}
              />
            </div>

            <div className="bg-gray-800 rounded-lg p-6 mt-6">
              <h2 className="text-2xl font-bold mb-4">Описание</h2>
              <p className="text-gray-300">
                {content.description || 'Описание отсутствует.'}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Информация</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Год:</span>
                  <span>{getYear(content.released)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Рейтинг:</span>
                  <span className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    {content.rating || '5'}/10
                  </span>
                </div>
                {content.kinopoisk_id && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">КиноПоиск ID:</span>
                    <span>{content.kinopoisk_id}</span>
                  </div>
                )}
                {content.imdb_id && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">IMDb ID:</span>
                    <span>{content.imdb_id}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Тип:</span>
                  <span>{content.type}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Постер</h2>
              <Image
                src={getPosterUrl(content)}
                alt={content.ru_title || content.title}
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