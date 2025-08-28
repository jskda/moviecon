import axios from 'axios'

const db = axios.create({ baseURL: '/api/db' })

// Добавьте interceptors для логирования
db.interceptors.request.use((config) => {
  console.log('🚀 API Request:', config.url)
  return config
})

db.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.data ? 'has data' : 'no data')
    return response
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.message)
    return Promise.reject(error)
  }
)

export const movieLocalApi = {
  getMovies: (params = {}) => db.get('/movies', { params }).then(r => r.data),
  getMovie: (id) => db.get(`/movies/${id}`).then(r => {
    console.log('📦 Movie data received:', r.data)
    return r.data
  }),
  searchMovies: (q) => db.get('/movies', { params: { q } }).then(r => r.data),
}

export const tvLocalApi = {
  getTvSeries: (params = {}) => db.get('/tv-series', { params }).then(r => r.data),
  getTvSeriesDetail: (id) => db.get(`/tv-series/${id}`).then(r => r.data),
}

export const animeLocalApi = {
  getAnimes: (params = {}) => db.get('/animes', { params }).then(r => r.data),
  getAnime: (id) => db.get(`/animes/${id}`).then(r => r.data),
}