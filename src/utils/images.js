export const getPosterUrl = (movie) => {
  if (movie.poster) {
    return movie.poster;
  }
  
  if (movie.kinopoisk_id) {
    return `https://st.kp.yandex.net/images/film_iphone/iphone360_${movie.kinopoisk_id}.jpg`;
  }

  return '/images/placeholder-poster.jpg';
};

export const getBackdropUrl = (movie) => {
  if (movie.backdrop) {
    return movie.backdrop;
  }
  
  return '/images/placeholder-poster.jpg';
};