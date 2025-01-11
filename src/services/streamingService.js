const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = '6cad0451c5d69d4048a83ec47dabae93';

// Cache for streaming data
const streamingCache = new Map();

export const streamingService = {
  getStreamingInfo: async (movieId) => {
    try {
      if (streamingCache.has(movieId)) {
        return streamingCache.get(movieId);
      }

      const response = await fetch(
        `${BASE_URL}/movie/${movieId}/watch/providers?api_key=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch streaming data');
      }

      const data = await response.json();
      const usProviders = data.results?.US || {};
      const streamingData = {
        streamingServices: {},
        watchLink: usProviders.link || `https://www.themoviedb.org/movie/${movieId}/watch`
      };

      // Only process subscription/streaming services
      if (usProviders.flatrate) {
        usProviders.flatrate.forEach(provider => {
          streamingData.streamingServices[provider.provider_name] = {
            logo: `https://image.tmdb.org/t/p/original${provider.logo_path}`,
            quality: 'HD'
          };
        });
      }

      streamingCache.set(movieId, streamingData);
      return streamingData;
    } catch (error) {
      console.error('Streaming API Error:', error);
      return null;
    }
  }
};