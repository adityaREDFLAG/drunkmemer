'use client';

import { useState, useEffect } from 'react';
import { FaHeart, FaShareAlt, FaSun, FaMoon } from 'react-icons/fa';

// Define the type for a meme
type Meme = {
  title: string;
  url: string;
};

const MemeDrunk = () => {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [likedMemes, setLikedMemes] = useState<Meme[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMemes();
  }, []);

  const fetchMemes = async () => {
    try {
      setError(null); // Reset error state before fetching
      const response = await fetch(`https://meme-api.com/gimme/10`);
      const data = await response.json();

      // Check if data contains memes array
      if (data.memes && Array.isArray(data.memes)) {
        setMemes(data.memes);
      } else {
        throw new Error('Invalid data structure');
      }
    } catch (error) {
      console.error('Error fetching memes:', error);
      setError('Failed to load memes. Please try again later.');
    }
  };

  const likeMeme = (meme: Meme) => {
    if (!likedMemes.some((liked) => liked.url === meme.url)) {
      setLikedMemes([...likedMemes, meme]);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.setAttribute('data-theme', isDarkMode ? 'light' : 'dark');
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Meme Drunk</h1>
        <button onClick={toggleTheme} className="theme-toggle">
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
      </header>

      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="meme-grid">
          {memes.map((meme, index) => (
            <div key={index} className="meme-card">
              <img src={meme.url} alt={meme.title} className="meme-image" />
              <div className="meme-actions">
                <button onClick={() => likeMeme(meme)} className="like-btn">
                  <FaHeart /> Like
                </button>
                <button className="share-btn">
                  <FaShareAlt /> Share
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <footer>
        <button onClick={fetchMemes} className="load-more">Load More Memes</button>
      </footer>
    </div>
  );
};

export default MemeDrunk;
