import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { tmdbApi } from '../../services/api';
import { streamingService } from '../../services/streamingService';
import './MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [streamingInfo, setStreamingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [streamingError, setStreamingError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setStreamingError(null);
        
        // First get movie details
        const movieData = await tmdbApi.getMovieDetails(id);
        setMovie(movieData);

        // Then try to get streaming info
        try {
          const streamingData = await streamingService.getStreamingInfo(id);
          if (streamingData) {
            setStreamingInfo(streamingData);
          } else {
            setStreamingError('Streaming information temporarily unavailable');
          }
        } catch (streamingError) {
          console.warn('Streaming info not available:', streamingError);
          setStreamingError(streamingError.message);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const renderStreamingServices = () => {
    if (!streamingInfo?.streamingServices || Object.keys(streamingInfo.streamingServices).length === 0) {
      return <p className="no-streaming">No streaming options available at this time.</p>;
    }

    return (
      <div className="streaming-options-container">
        <div className="streaming-services">
          {Object.entries(streamingInfo.streamingServices).map(([service, info]) => (
            <div key={service} className="streaming-service">
              {info.logo && <img src={info.logo} alt={service} className="service-logo" />}
              <span className="service-name">{service}</span>
            </div>
          ))}
        </div>
        <a 
          href={streamingInfo.watchLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="watch-now-button"
        >
          Watch Now
        </a>
      </div>
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!movie) return <div>Movie not found</div>;

  return (
    <div className="movie-details">
      <div className="movie-header">
        <h1>{movie.title}</h1>
        {movie.release_date && (
          <span className="year">({new Date(movie.release_date).getFullYear()})</span>
        )}
      </div>

      <div className="streaming-options">
        <h3>Streaming Options</h3>
        {streamingError ? (
          <p className="streaming-error">{streamingError}</p>
        ) : (
          renderStreamingServices()
        )}
      </div>

      {/* Rest of your movie details */}
    </div>
  );
};

export default MovieDetails; 