'use client';

import { useEffect, useState } from 'react';
import { FiHeart, FiShare2 } from 'react-icons/fi';
import { BsFillSunFill, BsFillMoonFill } from 'react-icons/bs'; // New Sun and Moon icons

interface Meme {
  id: string;
  url: string;
  title: string;
}

export default function Page() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [favorites, setFavorites] = useState<Meme[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [viewFavorites, setViewFavorites] = useState<boolean>(false);

  const toggleFavorite = (meme: Meme) => {
    setFavorites((prevFavorites) =>
      prevFavorites.some((fav) => fav.id === meme.id)
        ? prevFavorites.filter((fav) => fav.id !== meme.id)
        : [...prevFavorites, meme]
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
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <header className="flex justify-between items-center p-4">
        <h1 className="text-xl font-bold">Meme Drunk</h1>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full" onClick={handleToggleDarkMode}>
            {darkMode ? <BsFillSunFill size={24} /> : <BsFillMoonFill size={24} />}
          </button>
          <button className="p-2 rounded-full" onClick={() => setViewFavorites(!viewFavorites)}>
            <FiHeart size={24} />
          </button>
        </div>
      </header>

      {viewFavorites ? (
        <div className="flex flex-wrap justify-center">
          {favorites.map((meme) => (
            <div className="card" key={meme.id}>
              <img src={meme.url} alt={meme.title} className="rounded" />
              <div className="flex justify-between mt-2">
                <button className="button" onClick={() => toggleFavorite(meme)}>
                  {favorites.some((fav) => fav.id === meme.id) ? <FiHeart color="red" /> : <FiHeart />}
                </button>
                <button className="button">
                  <FiShare2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap justify-center">
          {memes.map((meme) => (
            <div className="card" key={meme.id}>
              <img src={meme.url} alt={meme.title} className="rounded" />
              <div className="flex justify-between mt-2">
                <button className="button" onClick={() => toggleFavorite(meme)}>
                  {favorites.some((fav) => fav.id === meme.id) ? <FiHeart color="red" /> : <FiHeart />}
                </button>
                <button className="button">
                  <FiShare2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-4">
        <button className="button" onClick={loadMoreMemes}>
          Load More Memes
        </button>
      </div>
    </div>
  );
}
