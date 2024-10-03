'use client';

import { useEffect, useState } from 'react';
import { FiHeart, FiMessageCircle, FiPlusCircle, FiShare2, FiSun, FiMoon } from 'react-icons/fi';

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
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-16 flex flex-col items-center justify-center bg-gray-800 text-white space-y-6">
        <button className="p-2" onClick={handleToggleDarkMode}>
          {darkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
        </button>
        <button className="p-2">
          <FiHeart size={24} />
        </button>
        <button className="p-2">
          <FiMessageCircle size={24} />
        </button>
        <button className="p-2">
          <FiPlusCircle size={24} />
        </button>
      </aside>

      {/* Main content */}
      <div className="ml-20 p-4">
        <header className="mb-4">
          <h1 className="text-2xl font-bold">Meme Drunk</h1>
        </header>

        {/* Meme Feed */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memes.map((meme) => (
            <div key={meme.id} className="bg-gray-100 rounded-lg shadow-md overflow-hidden">
              <img src={meme.url} alt={meme.title} className="w-full h-auto rounded-t-lg" />
              <div className="p-4 flex justify-between items-center">
                <button onClick={() => toggleFavorite(meme.id)}>
                  {favorites.includes(meme.id) ? (
                    <FiHeart className="text-red-500" size={24} />
                  ) : (
                    <FiHeart size={24} />
                  )}
                </button>
                <button>
                  <FiMessageCircle size={24} />
                </button>
                <button>
                  <FiShare2 size={24} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load more memes */}
        <div className="flex justify-center mt-8">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg" onClick={loadMoreMemes}>
            Load More Memes
          </button>
        </div>
      </div>
    </div>
  );
}
