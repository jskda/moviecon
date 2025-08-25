export const getPosterUrl = (movie) => {
  // Если в API Lumex есть прямые ссылки на изображения, используйте их
  if (movie.poster) {
    return movie.poster;
  }
  
  // Если есть kinopoisk_id, используем Яндекс.Кинопоиск
  if (movie.kinopoisk_id) {
    return `https://st.kp.yandex.net/images/film_iphone/iphone360_${movie.kinopoisk_id}.jpg`;
  }

  // Fallback - используем локальный плейсхолдер
  return '/images/placeholder-poster.jpg'; // Правильный путь из public/
};

export const getBackdropUrl = (movie) => {
  if (movie.backdrop) {
    return movie.backdrop;
  }
  
  return '/images/placeholder-poster.jpg'; // Используем тот же плейсхолдер
};