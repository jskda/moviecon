'use client'

import { useState } from 'react'

export default function Player({ 
  contentId, 
  contentType = 'movie', 
  translationId 
}) {
  const [isLoading, setIsLoading] = useState(true)
  
  const getPlayerUrl = () => {
    // Базовый URL плеера Lumex
    let url = `https://p.lumex.space/xgMZ05A06DRi/${contentType}/${contentId}`
    
    // Добавляем параметры перевода
    if (translationId) {
      url += `?translation=${translationId}`
    }
    
    console.log('Player URL:', url)
    return url
  }

  return (
    <div className="w-full">
      {isLoading && (
        <div className="w-full h-96 bg-gray-800 animate-pulse flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Загрузка плеера...</p>
          </div>
        </div>
      )}
      
      <div className={`player-container ${isLoading ? 'hidden' : 'block'}`}>
        <iframe
          src={getPlayerUrl()}
          className="player-iframe"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
          title="Video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
    </div>
  )
}