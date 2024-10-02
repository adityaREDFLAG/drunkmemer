"use client";

import { useEffect, useState } from "react";
import { Image } from "next/image";
import { IconType } from "react-icons/lib";
import { FaHeart, FaRegHeart } from "react-icons/fa";

interface Meme {
  id: string;
  title: string;
  url: string;
}

const Home = () => {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [favorites, setFavorites] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  
  const fetchMemes = async () => {
    try {
      const response = await fetch("https://meme-api.com/gimme/10");
      const data = await response.json();
      setMemes(data.memes);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching memes:", error);
    }
  };

  useEffect(() => {
    fetchMemes();
  }, []);

  const toggleFavorite = (memeId: string) => {
    const memeToToggle = memes.find(meme => meme.id === memeId);
    if (memeToToggle) {
      setFavorites(prevFavorites =>
        prevFavorites.includes(memeToToggle)
          ? prevFavorites.filter(meme => meme.id !== memeId)
          : [...prevFavorites, memeToToggle]
      );
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <div className={darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}>
      <nav className="flex justify-between p-4">
        <h1 className="text-2xl">Meme Drunk</h1>
        <button onClick={toggleDarkMode}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
        <button onClick={() => console.log(favorites)}>
          Favorites ({favorites.length})
        </button>
      </nav>
      <div className="flex flex-wrap justify-center">
        {loading ? (
          <p>Loading...</p>
        ) : (
          memes.map((meme) => (
            <div className="card" key={meme.id}>
              <Image src={meme.url} alt={meme.title} width={300} height={300} className="rounded" />
              <div className="flex justify-between mt-2">
                <button onClick={() => toggleFavorite(meme.id)}>
                  {favorites.includes(meme) ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart />
                  )}
                </button>
                <p className="font-bold">{meme.title}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <button className="load-more" onClick={fetchMemes}>
        Load More Memes
      </button>
    </div>
  );
};

export default Home;
