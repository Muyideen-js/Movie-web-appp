import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUser } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  window.onscroll = () => {
    setIsScrolled(window.pageYOffset === 0 ? false : true);
    return () => (window.onscroll = null);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container header-content">
        <div className="left">
          <Link to="/" className="logo">
            MovieHub
          </Link>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/movies">Movies</Link>
            <Link to="/tv-shows">TV Shows</Link>
            <Link to="/downloads">My Downloads</Link>
          </nav>
        </div>
        
        <div className="right">
          <div className="search">
            <input type="text" placeholder="Search..." />
            <FaSearch className="icon" />
          </div>
          <div className="user">
            <FaUser className="icon" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 