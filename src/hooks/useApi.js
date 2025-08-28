import { useQuery } from '@tanstack/react-query'

const API_BASE = '/api/db'

export const useMovie = (id) => {
  return useQuery({
    queryKey: ['movie', id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/movies/${id}`)
      if (!response.ok) {
        throw new Error(`Movie not found: ${response.status}`)
      }
      const movie = await response.json()
      return movie
    },
    enabled: !!id,
  })
}

export const useMovies = (params = {}) => {
  return useQuery({
    queryKey: ['movies', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams()
      queryParams.set('limit', params.limit || 20)
      queryParams.set('page', params.page || 1)
      queryParams.set('ordering', params.ordering || 'created')
      queryParams.set('direction', params.direction || 'desc')
      const response = await fetch(`${API_BASE}/movies?${queryParams}`)
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      const data = await response.json()
      return data
    },
    staleTime: 5 * 60 * 1000,
  })
}

export const useAnimes = (params = {}) => {
  return useQuery({
    queryKey: ['animes', params],
    queryFn: () => movieLocalApi.getMovies({ ...params, type: 'ANIME' }),
    staleTime: 5 * 60 * 1000,
  })
}

export const useTvSeries = (params = {}) => {
  return useQuery({
    queryKey: ['tv-series', params],
    queryFn: () => movieLocalApi.getMovies({ ...params, type: 'TV_SERIES' }),
    staleTime: 5 * 60 * 1000,
  })
}

export const useSearchMovies = (query) => {
  return useQuery({
    queryKey: ['search-movies', query],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/movies?q=${encodeURIComponent(query)}`)
      if (!response.ok) {
        throw new Error(`Search error: ${response.status}`)
      }
      const data = await response.json()
      return data
    },
    enabled: !!query && query.length > 2,
    staleTime: 5 * 60 * 1000,
  })
}

export { useMovie, useMovies, useSearchMovies }
