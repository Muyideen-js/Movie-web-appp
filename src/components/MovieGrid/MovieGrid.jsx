import React from 'react';
import { useSelector } from 'react-redux';
import MovieCard from '../MovieCard/MovieCard';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { tmdbApi } from '../../services/api';
import './MovieGrid.css';

const MovieGrid = () => {
  const { trending, loading, error } = useSelector((state) => state.movies);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <section className="movie-grid-section">
      <div className="container">
        <div className="movie-grid">
          {trending && trending.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={{
                id: movie.id,
                title: movie.title,
                posterUrl: movie.poster_path 
                  ? tmdbApi.getImageUrl(movie.poster_path) 
                  : null,
                year: movie.release_date 
                  ? new Date(movie.release_date).getFullYear() 
                  : null,
                rating: movie.vote_average 
                  ? movie.vote_average.toFixed(1) 
                  : null,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MovieGrid; 