import { useQuery } from '@tanstack/react-query'
import prisma from '@/lib/prisma'

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

// export const useMovies = (params = {}) => {
//   return useQuery({
//     queryKey: ['movies', params],
//     queryFn: async () => {
//       const queryParams = new URLSearchParams()
//       queryParams.set('limit', params.limit || 20)
//       queryParams.set('page', params.page || 1)
//       queryParams.set('ordering', params.ordering || 'created')
//       queryParams.set('direction', params.direction || 'desc')
//       const response = await fetch(`${API_BASE}/movies?${queryParams}`)
//       if (!response.ok) {
//         throw new Error(`API error: ${response.status}`)
//       }
//       const data = await response.json()
//       return data
//     },
//     staleTime: 5 * 60 * 1000,
//   })
// }

export const useMovies = (params = {}) => {
  return useQuery({
    queryKey: ['movies', params],
    queryFn: async () => {
      const movies = await prisma.content.findMany({
        take: params.limit || 20,
        skip: params.page ? (params.page - 1) * (params.limit || 20) : 0,
        orderBy: { createdAt: 'desc' }
      })
      
      const total = await prisma.content.count()
      
      return {
        data: movies,
        total,
        page: params.page || 1,
        pages: Math.ceil(total / (params.limit || 20))
      }
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