'use client';

import { useState, useEffect } from 'react';
import { FaHeart, FaShareAlt, FaStar, FaSun, FaMoon } from 'react-icons/fa';

const MemeDrunk = () => {
  const [memes, setMemes] = useState([]);
  const [likedMemes, setLikedMemes] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    fetchMemes();
  }, []);

  const fetchMemes = async () => {
    try {
      const subreddits = ['memes', 'dankmemes', 'funny', 'AdviceAnimals'];
      const response = await fetch(`https://meme-api.com/gimme/${subreddits.join(',')}/10`);
      const data = await response.json();
      setMemes(data.memes);
    } catch (error) {
      console.error('Error fetching memes:', error);
    }
  };

  const likeMeme = (meme) => {
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

      <footer>
        <button onClick={fetchMemes} className="load-more">Load More Memes</button>
      </footer>
    </div>
  );
};

export default MemeDrunk;
