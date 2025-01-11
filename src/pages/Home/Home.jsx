import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import MovieGrid from '../../components/MovieGrid/MovieGrid';
import { fetchTrendingMovies } from '../../store/movieSlice';
import './Home.css';

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTrendingMovies());
  }, [dispatch]);

  return (
    <main className="home">
      <MovieGrid />
    </main>
  );
};

export default Home; 