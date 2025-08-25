import { useQuery } from '@tanstack/react-query'
import { movieApi } from '@/utils/api'

export const useMovie = (id) => {
  return useQuery({
    queryKey: ['movie', id],
    queryFn: async () => {
      console.log('Fetching movie with identifier:', id)
      
      // Пробуем разные методы поиска
      try {
        // 1. Пробуем найти по ID (основной метод)
        try {
          const movie = await movieApi.getMovie(id)
          if (movie && movie.id) {
            console.log('Found by ID:', movie)
            return movie
          }
        } catch (error) {
          console.log('Not found by ID')
        }
        
        // 2. Пробуем найти по kinopoisk_id
        try {
          const movie = await movieApi.getMovieByKinopoiskId(id)
          if (movie && movie.id) {
            console.log('Found by Kinopoisk ID:', movie)
            return movie
          }
        } catch (error) {
          console.log('Not found by Kinopoisk ID')
        }
        
        // 3. Пробуем найти по imdb_id
        try {
          const movie = await movieApi.getMovieByImdbId(id)
          if (movie && movie.id) {
            console.log('Found by IMDB ID:', movie)
            return movie
          }
        } catch (error) {
          console.log('Not found by IMDB ID')
        }
        
        // 4. Пробуем поиск по query (названию или другому тексту)
        try {
          const searchResults = await movieApi.searchMovies(id)
          if (searchResults.data && searchResults.data.length > 0) {
            console.log('Found by search:', searchResults.data[0])
            return searchResults.data[0]
          }
        } catch (error) {
          console.log('Not found by search')
        }
        
        throw new Error(`Movie with identifier ${id} not found`)
      } catch (error) {
        console.error('All search methods failed:', error)
        throw error
      }
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  })
}

export const useMovies = (params = {}) => {
  return useQuery({
    queryKey: ['movies', params],
    queryFn: () => movieApi.getMovies(params),
    staleTime: 5 * 60 * 1000,
  })
}

export const useSearchMovies = (query) => {
  return useQuery({
    queryKey: ['search-movies', query],
    queryFn: () => movieApi.searchMovies(query),
    enabled: !!query && query.length > 2,
    staleTime: 5 * 60 * 1000,
  })
}