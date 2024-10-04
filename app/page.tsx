'use client';

import { useState, useEffect } from 'react';
import { FaHeart, FaShareAlt, FaStar, FaSun, FaMoon } from 'react-icons/fa'; // Import icons

type Meme = {
  title: string;
  url: string;
};

const MemeDrunk = () => {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [page, setPage] = useState(1);
  const [likedMemes, setLikedMemes] = useState<Meme[]>([]);
  const [showFavorites, setShowFavorites] = useState(false); // To toggle between memes and favorites
  const [isDarkMode, setIsDarkMode] = useState(false); // For theme toggling

  useEffect(() => {
    fetchMemes();
  }, [page]);

  useEffect(() => {
    const storedLikes = localStorage.getItem('likedMemes');
    if (storedLikes) {
      setLikedMemes(JSON.parse(storedLikes));
    }
  }, []);

  // Toggle dark and light mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.setAttribute('data-theme', isDarkMode ? 'light' : 'dark');
  };

  const fetchMemes = async () => {
    try {
      // Fetch memes from random subreddits for variety
      const subreddits = ['memes', 'dankmemes', 'funny', 'AdviceAnimals'];
      const response = await fetch(
        `https://meme-api.com/gimme/${subreddits.join(',')}/10?page=${page}`
      );
      const data = await response.json();
      setMemes((prev) => [...prev, ...data.memes]);
    } catch (error) {
      console.error('Error fetching memes:', error);
    }
  };

  const likeMeme = (meme: Meme) => {
    const isLiked = likedMemes.some((liked) => liked.url === meme.url);
    if (!isLiked) {
      const updatedLikes = [...likedMemes, meme];
      setLikedMemes(updatedLikes);
      localStorage.setItem('likedMemes', JSON.stringify(updatedLikes));
    }
  };

  const shareMeme = async (meme: Meme) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: meme.title,
          url: meme.url,
        });
        console.log('Meme shared successfully!');
      } catch (error) {
        console.error('Error sharing meme:', error);
      }
    } else {
      navigator.clipboard.writeText(meme.url);
      alert('Meme link copied to clipboard!');
    }
  };

  return (
    <div className="meme-container">
      {/* Theme toggle button */}
      <button className="theme-toggle" onClick={toggleTheme}>
        {isDarkMode ? <FaSun /> : <FaMoon />}
      </button>

      {/* Favorites button */}
      <button
        className="favorites-btn"
        onClick={() => setShowFavorites(!showFavorites)}
      >
        <FaStar />
        {showFavorites ? ' Show All Memes' : ' Show Favorites'}
      </button>

      {/* Meme list or Favorites */}
      {showFavorites
        ? likedMemes.map((meme, index) => (
            <div key={index} className="meme-card">
              <h3>{meme.title}</h3>
              <img src={meme.url} alt={meme.title} />
              <div className="buttons">
                <button className="like-btn" onClick={() => likeMeme(meme)}>
                  <FaHeart /> Liked
                </button>
                <button className="share-btn" onClick={() => shareMeme(meme)}>
                  <FaShareAlt /> Share
                </button>
              </div>
            </div>
          ))
        : memes.map((meme, index) => (
            <div key={index} className="meme-card">
              <h3>{meme.title}</h3>
              <img src={meme.url} alt={meme.title} />
              <div className="buttons">
                <button className="like-btn" onClick={() => likeMeme(meme)}>
                  <FaHeart /> Like
                </button>
                <button className="share-btn" onClick={() => shareMeme(meme)}>
                  <FaShareAlt /> Share
                </button>
              </div>
            </div>
          ))}

      {/* Load More button */}
      {!showFavorites && (
        <button className="load-more" onClick={() => setPage(page + 1)}>
          Load More Memes
        </button>
      )}
    </div>
  );
};

export default MemeDrunk;
