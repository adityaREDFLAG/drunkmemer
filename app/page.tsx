'use client';

import { useEffect, useState } from 'react';
import { FiHeart, FiShare2 } from 'react-icons/fi';
import { IoMoon, IoSunny } from 'react-icons/io5'; // Updated icons

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
    const response = await fetch('https://meme-api.com/gimme/10');
    const data = await response.json();
    setMemes((prev) => [...prev, ...data.memes]);
  };

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.documentElement.classList.toggle('dark', !darkMode);
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
      <main className="flex flex-col items-center py-6">
        {memes.map((meme) => (
          <div key={meme.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6 w-full max-w-md p-4 transition-transform hover:scale-105">
            <h2 className="text-lg font-semibold mb-2">{meme.title}</h2>
            <img src={meme.url} alt={meme.title} className="rounded-md w-full mb-2" />
            <div className="flex justify-between">
              <button className="like-btn" onClick={() => toggleFavorite(meme.id)}>
                {favorites.includes(meme.id) ? <FiHeart className="text-red-500" /> : <FiHeart />}
              </button>
              <button className="share-btn">
                <FiShare2 />
              </button>
            </div>
          </div>
        ))}
      </main>
      <div className="flex justify-center mt-8">
        <button className="load-more-btn" onClick={loadMoreMemes}>
          Load More Memes
        </button>
      </div>
    </div>
  );
}
