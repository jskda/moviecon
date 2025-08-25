import axios from 'axios'

const API_BASE_URL = 'https://portal.lumex.host/api'
const API_TOKEN = 'mCSbTETUoTFAUzpOBa4Cx156dGkVHK5F'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// Интерцептор для добавления API токена
api.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    api_token: API_TOKEN
  }
  return config
})

// Методы API
export const movieApi = {
  // Получить список фильмов
  getMovies: (params = {}) => 
    api.get('/movies', { params })
      .then(res => {
        console.log('Movies API response:', res.data)
        return res.data
      }),

  // Получить конкретный фильм по ID - ПРАВИЛЬНАЯ реализация
  getMovie: (id) => 
    api.get('/movies', { params: { id } })
      .then(res => {
        console.log('Movie API response for ID', id, ':', res.data)
        
        if (res.data.data && Array.isArray(res.data.data)) {
          // Ищем фильм с конкретным ID в массиве
          const foundMovie = res.data.data.find(movie => movie.id == id)
          
          if (foundMovie) {
            console.log('Found movie with ID', id, ':', foundMovie)
            return foundMovie
          } else {
            console.log('Movie with ID', id, 'not found in response array')
            // Покажем какие ID есть в ответе для отладки
            const availableIds = res.data.data.map(m => m.id)
            console.log('Available IDs in response:', availableIds)
            throw new Error(`Movie with ID ${id} not found. Available IDs: ${availableIds.join(', ')}`)
          }
        }
        
        throw new Error('Invalid API response format')
      }),

  // Поиск фильмов
  searchMovies: (query) => 
    api.get('/short', { params: { query } })
      .then(res => res.data)
}

export default api