'use client'

import { useState } from 'react'
import { API_URLS } from '@/utils/apiUrls'

export default function ApiTestPage() {
  const [testId, setTestId] = useState('765')
  const [results, setResults] = useState(null)

  const testUrls = () => {
    const testResults = {
      kinopoisk: API_URLS.kinopoisk(testId),
      imdb: API_URLS.imdb(`tt${testId}`),
      internal: API_URLS.internal(testId),
      title: API_URLS.title('Test'),
      movies: API_URLS.movies({ limit: 5 })
    }
    
    setResults(testResults)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Тестирование API URL</h1>
      
      <div className="mb-6">
        <input
          type="text"
          value={testId}
          onChange={(e) => setTestId(e.target.value)}
          placeholder="Введите ID для теста"
          className="px-4 py-2 bg-gray-800 text-white rounded mr-2"
        />
        <button
          onClick={testUrls}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Сгенерировать URL
        </button>
      </div>

      {results && (
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Сгенерированные URL:</h2>
          
          <div className="space-y-4">
            {Object.entries(results).map(([key, url]) => (
              <div key={key} className="p-3 bg-gray-700 rounded">
                <h3 className="font-semibold mb-2 capitalize">{key}:</h3>
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 underline break-all"
                >
                  {url}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}