'use client';

import { useEffect, useState } from 'react';
import { FiHeart, FiShare2 } from 'react-icons/fi';
import { IoMoon, IoSunny } from 'react-icons/io5'; // Dark/Light mode icons

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
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'} transition-all duration-300`}>
      <header className="flex justify-between items-center p-6 shadow-md bg-white dark:bg-gray-800">
        <h1 className="text-3xl font-bold tracking-tight">Meme Drunk</h1>
        <div className="flex items-center space-x-6">
          <button
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
            onClick={handleToggleDarkMode}
          >
            {darkMode ? <IoSunny size={28} /> : <IoMoon size={28} />}
          </button>
          <button className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200">
            <FiHeart size={24} />
          </button>
        </div>
      </header>

      <main className="flex flex-col items-center py-10">
        <div className="grid grid-cols-1 gap-8 w-full max-w-4xl">
          {memes.map((meme) => (
            <div
              key={meme.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
            >
              <h2 className="text-lg font-semibold mb-3 text-center">{meme.title}</h2>
              <img
                src={meme.url}
                alt={meme.title}
                className="rounded-md w-full object-contain mb-4 transition-opacity duration-300 hover:opacity-90"
              />
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  className={`like-btn p-2 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-red-500 hover:text-white transition-all duration-300 ${
                    favorites.includes(meme.id) ? 'bg-red-500 text-white' : ''
                  }`}
                  onClick={() => toggleFavorite(meme.id)}
                >
                  <FiHeart size={24} />
                </button>
                <button className="share-btn p-2 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-blue-500 hover:text-white transition-all duration-300">
                  <FiShare2 size={24} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <div className="flex justify-center mt-10">
        <button className="p-4 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all duration-300">
          Load More Memes
        </button>
      </div>
    </div>
  );
}
