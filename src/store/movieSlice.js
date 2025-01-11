import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tmdbApi } from '../services/api';

const initialState = {
  trending: [],
  filtered: [],
  loading: false,
  error: null,
};

export const fetchTrendingMovies = createAsyncThunk(
  'movies/fetchTrending',
  async (_, { rejectWithValue }) => {
    try {
      const response = await tmdbApi.getTrending();
      
      // Fetch trailers for each movie
      const moviesWithTrailers = await Promise.all(
        response.results.map(async (movie) => {
          try {
            const videoData = await tmdbApi.getMovieVideos(movie.id);
            const trailer = videoData.results.find(
              (video) => video.type === 'Trailer' && video.site === 'YouTube'
            );
            return {
              ...movie,
              trailerKey: trailer ? trailer.key : null,
            };
          } catch (error) {
            console.error(`Failed to fetch trailer for movie ${movie.id}:`, error);
            return { ...movie, trailerKey: null };
          }
        })
      );

      return moviesWithTrailers;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMoviesByGenre = createAsyncThunk(
  'movies/fetchByGenre',
  async (genreId, { rejectWithValue }) => {
    try {
      const response = await tmdbApi.getMoviesByGenre(genreId);
      if (!response.results) {
        throw new Error('No results found in API response');
      }
      return response.results;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrendingMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrendingMovies.fulfilled, (state, action) => {
        state.trending = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchTrendingMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch movies';
      })
      // Movies by genre
      .addCase(fetchMoviesByGenre.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMoviesByGenre.fulfilled, (state, action) => {
        state.filtered = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchMoviesByGenre.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch movies by genre';
      });
  },
});

export default movieSlice.reducer; 