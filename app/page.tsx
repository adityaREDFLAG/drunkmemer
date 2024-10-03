'use client';

import { useEffect, useState } from 'react';
import { FiHeart, FiShare2, FiSun, FiMoon } from 'react-icons/fi';

interface Meme {
  id: string;
  url: string;
  title: string;
}

export default function Page() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [likedMeme, setLikedMeme] = useState<string | null>(null); // To store the liked meme
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const toggleFavorite = (id: string) => {
    // Only allow one liked meme at a time
    setLikedMeme((prev) => (prev === id ? null : id));
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
    <div className={`min-h-screen ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <header className="flex justify-between items-center p-4">
        <h1 className="text-xl font-bold">Meme Drunk</h1>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full" onClick={handleToggleDarkMode}>
            {darkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
          </button>
          <button className="p-2 rounded-full" onClick={() => alert('Favorites feature coming soon!')}>
            <FiHeart size={24} />
          </button>
        </div>
      </header>
      <div className="flex flex-wrap justify-center">
        {memes.map((meme) => (
          <div className="card" key={meme.id}>
            <img src={meme.url} alt={meme.title} className="rounded" />
            <div className="flex justify-between mt-2">
              <button className="button" onClick={() => toggleFavorite(meme.id)}>
                {likedMeme === meme.id ? <FiHeart color="red" /> : <FiHeart />}
              </button>
              <button className="button">
                <FiShare2 />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <button className="button" onClick={loadMoreMemes}>
          Load More Memes
        </button>
      </div>
    </div>
  );
}
