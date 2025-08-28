export const parseRawData = (content) => {
  if (!content.raw) return content;
  
  try {
    const rawData = JSON.parse(content.raw);
    
    return {
      ...content,
      title: content.title || rawData.orig_title || rawData.title,
      ru_title: content.ru_title || rawData.ru_title,
      description: content.description || rawData.description,
      year: content.year || (rawData.released ? new Date(rawData.released).getFullYear() : null),
      released: content.released || rawData.released,
      poster: content.poster || `https://st.kp.yandex.net/images/film_iphone/iphone360_${rawData.kinopoisk_id}.jpg`,
      kinopoisk_id: content.kinopoisk_id || rawData.kinopoisk_id,
      imdb_id: content.imdb_id || rawData.imdb_id,
      rating: content.rating || rawData.rating,
      iframe_src: content.iframe_src || rawData.iframe_src,
    };
  } catch (error) {
    console.error('Error parsing raw data:', error);
    return content;
  }
};