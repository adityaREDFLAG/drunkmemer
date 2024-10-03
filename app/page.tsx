

'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

// Define the type of a meme
type Meme = {
  title: string;
  url: string;
};

const MemeDrunk = () => {
  // State to store the array of memes and track page number
  const [memes, setMemes] = useState<Meme[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [likedMemes, setLikedMemes] = useState<Meme[]>([]);

  // Fetch memes when the page number updates
  useEffect(() => {
    fetchMemes();
  }, [page]);

  // Load liked memes from localStorage when the component mounts
  useEffect(() => {
    const storedLikes = localStorage.getItem('likedMemes');
    if (storedLikes) {
      setLikedMemes(JSON.parse(storedLikes));
    }
  }, []);

  // Fetch memes from API (using useCallback to avoid being recreated every render)
  const fetchMemes = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://meme-api.com/gimme/10?page=${page}`);
      if (!response.ok) throw new Error('Failed to fetch memes');
      const data = await response.json();
      setMemes((prev) => [...prev, ...data.memes]);
    } catch (error) {
      console.error('Error fetching memes:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  // Like a meme and store it in localStorage
  const likeMeme = (meme: Meme) => {
    const isAlreadyLiked = likedMemes.some((likedMeme) => likedMeme.url === meme.url);
    if (!isAlreadyLiked) {
      const updatedLikes = [...likedMemes, meme];
      setLikedMemes(updatedLikes);
      localStorage.setItem('likedMemes', JSON.stringify(updatedLikes));
    }
  };

  // Display liked memes
  const viewLikedMemes = () => {
    setMemes(likedMemes);
  };

  return (
    <div className="meme-drunk">
      <div className="meme-drunk__container">
        {/* Render memes */}
        {memes.map((meme, index) => (
          <div key={index} className="meme-drunk__card">
            <h3 className="meme-drunk__title">{meme.title}</h3>
            <Image
              src={meme.url}
              alt={meme.title}
              width={500} // Adjust width based on design
              height={500} // Adjust height based on design
              className="meme-drunk__image"
              priority={index === 0} // prioritize the first image for faster loading
            />
            <div className="meme-drunk__actions">
              <button className="meme-drunk__like-btn" onClick={() => likeMeme(meme)}>
                ❤️ Like
              </button>
              <button className="meme-drunk__share-btn">🔗 Share</button>
            </div>
          </div>
        ))}

        {/* Load More Memes button */}
        <button
          className="meme-drunk__load-more"
          onClick={() => setPage((prevPage) => prevPage + 1)}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Load More Memes'}
        </button>

        {/* View Liked Memes button */}
        <button className="meme-drunk__view-likes" onClick={viewLikedMemes}>
          View My Likes
        </button>
      </div>
    </div>
  );
};

export default MemeDrunk;
