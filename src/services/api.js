const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = '6cad0451c5d69d4048a83ec47dabae93'; 
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const tmdbApi = {
  // Image URLs
  getImageUrl: (path, size = 'w500') => `${IMAGE_BASE_URL}/${size}${path}`,

  // Fetch trending movies
  getTrending: async () => {
    const response = await fetch(
      `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`
    );
    return response.json();
  },

  // Fetch movies by genre
  getMoviesByGenre: async (genreId) => {
    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`
    );
    return response.json();
  },

  // Fetch movie details
  getMovieDetails: async (movieId) => {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos`
    );
    return response.json();
  },

  getMovieVideos: async (movieId) => {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch movie videos');
    }
    return response.json();
  },
}; 