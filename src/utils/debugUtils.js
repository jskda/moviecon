import { movieApi } from './api'

export const debugApiResponse = async (identifier) => {
  console.log('=== Debug API Response ===')
  console.log('Identifier:', identifier)
  
  const methods = [
    { name: 'searchByKinopoiskId', method: () => movieApi.searchByKinopoiskId(identifier) },
    { name: 'searchByImdbId', method: () => movieApi.searchByImdbId(identifier) },
    { name: 'searchById', method: () => movieApi.searchById(identifier) },
    { name: 'searchByTitle', method: () => movieApi.searchByTitle(identifier) },
  ]

  const results = {}
  
  for (const method of methods) {
    try {
      const result = await method.method()
      results[method.name] = {
        success: true,
        data: result.data,
        total: result.data?.length
      }
      console.log(`${method.name}:`, result.data)
    } catch (error) {
      results[method.name] = {
        success: false,
        error: error.message
      }
      console.log(`${method.name} failed:`, error.message)
    }
  }
  
  return results
}