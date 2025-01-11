import { useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  const [showVideo, setShowVideo] = useState(false);
  const navigate = useNavigate();
  const { id, title, posterUrl, year, rating } = movie;

  const handleClick = (e) => {
    if (e.target.closest('.play-btn')) {
      e.stopPropagation();
      setShowVideo(true);
    } else {
      navigate(`/movie/${id}`);
    }
  };

  return (
    <>
      <div className="movie-card" onClick={handleClick}>
        {posterUrl && (
          <div className="movie-poster">
            <img src={posterUrl} alt={title} loading="lazy" />
            <button className="play-btn">
              <FaPlay />
            </button>
          </div>
        )}
        <div className="movie-info">
          <h3 className="movie-title">{title}</h3>
          <div className="movie-meta">
            {year && <span className="movie-year">{year}</span>}
            {rating && <span className="movie-rating">⭐ {rating}</span>}
          </div>
        </div>
      </div>
      
      {showVideo && (
        <VideoPlayer 
          movieId={id}
          onClose={() => setShowVideo(false)} 
        />
      )}
    </>
  );
};

export default MovieCard; 