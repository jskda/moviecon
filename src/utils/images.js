// Утилиты для работы с изображениями из API
export const getPosterUrl = (movie) => {
  // Если в API есть прямая ссылка на постер - используем ее
  if (movie?.poster) {
    return movie.poster
  }
  
  // Если есть kinopoisk_id - используем Яндекс.Кинопоиск
  if (movie?.kinopoisk_id) {
    return `https://st.kp.yandex.net/images/film_iphone/iphone360_${movie.kinopoisk_id}.jpg`
  }
  
  // Если есть imdb_id - можно использовать OMDB (нужен API ключ)
  if (movie?.imdb_id) {
    return `https://img.omdbapi.com/?i=${movie.imdb_id}&h=450&apikey=your_key`
  }
}

export const getBackdropUrl = (movie) => {
  // Если в API есть прямая ссылка на бэкдроп - используем ее
  if (movie?.backdrop) {
    return movie.backdrop
  }
  
  // Если есть kinopoisk_id - используем большой постер с Кинопоиска
  if (movie?.kinopoisk_id) {
    return `https://st.kp.yandex.net/images/film_big_iphone/${movie.kinopoisk_id}.jpg`
  }
}