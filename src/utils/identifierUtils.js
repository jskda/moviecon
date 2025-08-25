// Утилиты для определения типа идентификатора
export const identifyType = (identifier) => {
  if (!identifier) return 'unknown'
  
  // Kinopoisk ID: 6-7 цифр (например: 654, 258687)
  if (/^\d{4,7}$/.test(identifier)) {
    return 'kinopoisk_id'
  }
  
  // IMDB ID: начинается с tt и 7-8 цифр (например: tt0295297)
  if (/^tt\d{7,8}$/.test(identifier)) {
    return 'imdb_id'
  }
  
  // Numeric ID: длинный числовой ID (например: 84581)
  if (/^\d+$/.test(identifier) && identifier.length > 3) {
    return 'numeric_id'
  }
  
  // Text: название фильма
  return 'title'
}

// Получить URL для поиска
const API_BASE = '/api/lx'

export const generateApiUrl = (endpoint, params = {}) => {
  const queryParams = new URLSearchParams(params)
  return `${API_BASE}${endpoint}?${queryParams.toString()}`
}
  
  switch (type) {
    case 'kinopoisk_id':
    case 'numeric_id':
      return `${baseUrl}?api_token=${token}&kinopoisk_id=${identifier}`
    case 'imdb_id':
      return `${baseUrl}?api_token=${token}&imdb_id=${identifier}`
    case 'title':
      return `${baseUrl}?api_token=${token}&query=${encodeURIComponent(identifier)}`
    default:
      return `${baseUrl}?api_token=${token}`
  }
}