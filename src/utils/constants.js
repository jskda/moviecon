export const CONTENT_TYPES = {
  MOVIE: 'movie',
  TV_SERIES: 'tv-series',
  ANIME: 'anime',
  ANIME_TV_SERIES: 'anime-tv-series',
  SHOW_TV_SERIES: 'show-tv-series'
}

export const SORT_OPTIONS = [
  { value: 'created', label: 'По дате добавления' },
  { value: 'rating', label: 'По рейтингу' },
  { value: 'title', label: 'По названию' },
  { value: 'year', label: 'По году' }
]

export const QUALITY_OPTIONS = [
  { value: '240', label: '240p' },
  { value: '360', label: '360p' },
  { value: '480', label: '480p' },
  { value: '720', label: '720p HD' },
  { value: '1080', label: '1080p Full HD' }
]