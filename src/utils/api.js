import axios from 'axios'

const API_BASE_URL = 'https://portal.lumex.host/api'
const API_TOKEN = 'mCSbTETUoTFAUzpOBa4Cx156dGkVHK5F'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// Базовый метод для всех запросов
const makeApiRequest = (endpoint, params = {}) => {
  // Всегда добавляем api_token первым параметром
  const queryParams = new URLSearchParams()
  queryParams.append('api_token', API_TOKEN)
  
  // Добавляем остальные параметры
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value)
    }
  })
  
  const url = `${endpoint}?${queryParams.toString()}`
  console.log('API Request:', url)
  
  return api.get(url)
}

// Методы API
export const movieApi = {
  // Поиск фильмов через /short endpoint - ОСНОВНОЙ МЕТОД!
  searchMovies: (params = {}) =>
    makeApiRequest('/short', params)
      .then(res => {
        console.log('Search API response:', res.data)
        return res.data
      }),

  // Получить список фильмов через /movies
  getMovies: (params = {}) =>
    makeApiRequest('/movies', params)
      .then(res => {
        console.log('Movies API response:', res.data)
        return res.data
      }),

  // Специализированные методы поиска
  searchByKinopoiskId: (kinopoiskId) =>
    makeApiRequest('/short', { kinopoisk_id: kinopoiskId })
      .then(res => {
        console.log('Search by Kinopoisk ID response:', res.data)
        return res.data
      }),

  searchByImdbId: (imdbId) =>
    makeApiRequest('/short', { imdb_id: imdbId })
      .then(res => {
        console.log('Search by IMDB ID response:', res.data)
        return res.data
      }),

  searchByTitle: (title) =>
    makeApiRequest('/short', { title })
      .then(res => {
        console.log('Search by title response:', res.data)
        return res.data
      }),

  searchById: (id) =>
    makeApiRequest('/short', { id })
      .then(res => {
        console.log('Search by ID response:', res.data)
        return res.data
      })
}

export default api