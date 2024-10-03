'use client';

import { useEffect, useState } from 'react';
import { FiHeart, FiShare2 } from 'react-icons/fi';
import { IoMoon, IoSunny } from 'react-icons/io5'; // Updated icons for sun and moon

interface Meme {
  id: string;
  url: string;
  title: string;
}

export default function Page() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favoriteId) => favoriteId !== id) : [...prev, id]
    );
  };

  const loadMoreMemes = async () => {
    const response = await fetch('https://meme-api.com/gimme/10'); // Fetch 10 memes
    const data = await response.json();
    setMemes((prev) => [...prev, ...data.memes]);
  };

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  useEffect(() => {
    loadMoreMemes();
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'} transition-colors`}>
      <header className="flex justify-between items-center p-4 shadow-md bg-white dark:bg-gray-800">
        <h1 className="text-2xl font-bold">Meme Drunk</h1>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" onClick={handleToggleDarkMode}>
            {darkMode ? <IoSunny size={24} /> : <IoMoon size={24} />}
          </button>
          <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <FiHeart size={24} />
          </button>
        </div>
      </header>
      <div className="flex flex-wrap justify-center p-4">
        {memes.map((meme) => (
          <div className="meme-card" key={meme.id}>
            <img src={meme.url} alt={meme.title} className="rounded-lg shadow-lg" />
            <div className="flex justify-between mt-2">
              <button className="like-btn" onClick={() => toggleFavorite(meme.id)}>
                {favorites.includes(meme.id) ? <FiHeart color="red" /> : <FiHeart />}
              </button>
              <button className="share-btn">
                <FiShare2 />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <button className="load-more-btn" onClick={loadMoreMemes}>
          Load More Memes
        </button>
      </div>
    </div>
  );
}
