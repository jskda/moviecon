import axios from 'axios'

const db = axios.create({ baseURL: '/api/db' })

export const movieLocalApi = {
  getMovies: (params = {}) => db.get('/movies', { params }).then(r => r.data),
  getMovie:  (id) => db.get(`/movies/${id}`).then(r => r.data),
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