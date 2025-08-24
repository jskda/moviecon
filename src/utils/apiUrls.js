const API_BASE_URL = 'https://portal.lumex.host/api'
const API_TOKEN = 'mCSbTETUoTFAUzpOBa4Cx156dGkVHK5F'

// Генерация правильных URL для API запросов
export const generateApiUrl = (endpoint, params = {}) => {
  const queryParams = new URLSearchParams()
  queryParams.append('api_token', API_TOKEN)
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString())
    }
  })
  
  return `${API_BASE_URL}${endpoint}?${queryParams.toString()}`
}

// Примеры URL для тестирования
export const API_URLS = {
  // Поиск по kinopoisk_id
  kinopoisk: (id) => generateApiUrl('/short', { kinopoisk_id: id }),
  
  // Поиск по imdb_id  
  imdb: (id) => generateApiUrl('/short', { imdb_id: id }),
  
  // Поиск по internal id
  internal: (id) => generateApiUrl('/short', { id }),
  
  // Поиск по названию
  title: (title) => generateApiUrl('/short', { title }),
  
  // Получение списка фильмов
  movies: (params = {}) => generateApiUrl('/movies', params)
}