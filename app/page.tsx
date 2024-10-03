'use client';

import { useState, useEffect } from 'react';
import { AiOutlineHeart, AiOutlineShareAlt } from 'react-icons/ai';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

type Meme = {
  title: string;
  url: string;
};

const MemeDrunk = () => {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [page, setPage] = useState(1);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchMemes();
  }, [page]);

  const fetchMemes = async () => {
    try {
      const response = await fetch(`https://meme-api.com/gimme/10?page=${page}`);
      const data = await response.json();
      setMemes((prev) => [...prev, ...data.memes]);
    } catch (error) {
      console.error('Error fetching memes:', error);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}>
      <header className="flex justify-between items-center p-4 border-b">
        <h1 className="text-2xl font-semibold">Meme Drunk</h1>
        <button onClick={toggleDarkMode} className="p-2 rounded-full">
          {darkMode ? <SunIcon boxSize={6} /> : <MoonIcon boxSize={6} />}
        </button>
      </header>

      <main className="p-4 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {memes.map((meme, index) => (
          <div key={index} className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg p-4 hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold mb-2">{meme.title}</h3>
            <img src={meme.url} alt={meme.title} className="w-full h-64 object-cover rounded-md mb-4" />
            <div className="flex justify-between items-center">
              <button className="flex items-center space-x-2 text-lg">
                <AiOutlineHeart className="text-red-500" /> <span>Like</span>
              </button>
              <button className="flex items-center space-x-2 text-lg">
                <AiOutlineShareAlt className="text-blue-500" /> <span>Share</span>
              </button>
            </div>
          </div>
        ))}
      </main>

      <footer className="flex justify-center p-4">
        <button
          onClick={() => setPage(page + 1)}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Load More Memes
        </button>
      </footer>
    </div>
  );
};

export default MemeDrunk;
