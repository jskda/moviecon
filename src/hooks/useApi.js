import { useQuery } from '@tanstack/react-query'
import { movieApi } from '@/utils/api'

export const useMovie = (identifier) => {
  return useQuery({
    queryKey: ['movie', identifier],
    queryFn: async () => {
      console.log('Fetching movie with identifier:', identifier)
      
      if (!identifier) {
        throw new Error('Identifier is required')
      }

      // Пробуем все методы поиска
      const searchMethods = [
        { name: 'kinopoisk_id', method: () => movieApi.searchByKinopoiskId(identifier) },
        { name: 'imdb_id', method: () => movieApi.searchByImdbId(identifier) },
        { name: 'internal_id', method: () => movieApi.searchById(identifier) },
        { name: 'title', method: () => movieApi.searchByTitle(identifier) },
      ]

      for (const method of searchMethods) {
        try {
          const result = await method.method()
          // Проверяем что есть данные и это массив
          if (result?.data?.length > 0) {
            console.log(`Found by ${method.name}:`, result.data[0])
            return result.data[0]
          }
        } catch (error) {
          console.log(`Not found by ${method.name}:`, error.message)
          continue
        }
      }

      throw new Error(`Movie with identifier "${identifier}" not found`)
    },
    enabled: !!identifier,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  })
}