'use client';

import { useState, useEffect } from 'react';
import { FaHeart, FaShareAlt, FaStar } from 'react-icons/fa'; // Import custom icons

type Meme = {
  title: string;
  url: string;
};

const MemeDrunk = () => {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [page, setPage] = useState(1);
  const [likedMemes, setLikedMemes] = useState<Meme[]>([]);
  const [showFavorites, setShowFavorites] = useState(false); // Toggle between memes and favorites

  useEffect(() => {
    fetchMemes();
  }, [page]);

  useEffect(() => {
    const storedLikes = localStorage.getItem('likedMemes');
    if (storedLikes) {
      setLikedMemes(JSON.parse(storedLikes));
    }
  }, []);

  const fetchMemes = async () => {
    try {
      const response = await fetch(`https://meme-api.com/gimme/10?page=${page}`);
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
