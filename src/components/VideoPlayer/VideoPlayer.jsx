import { useRef, useEffect, useState } from 'react';
import { FaTimes, FaExpand } from 'react-icons/fa';
import { videoService } from '../../services/videoService';
import './VideoPlayer.css';

const VideoPlayer = ({ movieId, onClose }) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoHeaders, setVideoHeaders] = useState(null);

  useEffect(() => {
    const loadVideo = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await videoService.getVideoUrl(movieId);
        setVideoUrl(data.url);
        setVideoHeaders(data.headers);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadVideo();
  }, [movieId]);

  useEffect(() => {
    if (videoRef.current && videoHeaders) {
      const headersList = new Headers(videoHeaders);
      fetch(videoUrl, { headers: headersList })
        .then(response => {
          if (!response.ok) throw new Error('Video stream failed');
          return response.blob();
        })
        .then(blob => {
          videoRef.current.src = URL.createObjectURL(blob);
        })
        .catch(err => setError(err.message));
    }
  }, [videoUrl, videoHeaders]);

  // Track video progress
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = videoRef.current.currentTime / videoRef.current.duration;
      videoService.updateProgress(movieId, progress);
    }
  };

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  if (isLoading) return <div className="video-loading">Loading...</div>;
  if (error) return (
    <div className="video-error">
      <p>{error}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );

  return (
    <div className="video-player-overlay">
      <div className="video-container">
        <video
          ref={videoRef}
          className="video-player"
          controls
          autoPlay
          playsInline
          onTimeUpdate={handleTimeUpdate}
        >
          <source 
            src={videoUrl} 
            type="video/mp4"
            headers={videoHeaders}
          />
          Your browser does not support the video tag.
        </video>

        <div className="video-controls">
          <button className="control-btn" onClick={toggleFullscreen}>
            <FaExpand />
          </button>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer; 