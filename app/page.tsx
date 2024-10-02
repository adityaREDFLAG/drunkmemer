"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { MdOutlineDarkMode, MdOutlineWbSunny } from "react-icons/md";

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

  // Fetch memes from the API
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
    // Load favorites from local storage
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    // Save favorites to local storage whenever favorites change
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (memeId: string) => {
    const memeToToggle = memes.find((meme) => meme.id === memeId);
    if (memeToToggle) {
      setFavorites((prevFavorites) =>
        prevFavorites.some((meme) => meme.id === memeId)
          ? prevFavorites.filter((meme) => meme.id !== memeId)
          : [...prevFavorites, memeToToggle]
      );
    }
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div className={darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}>
      <nav className="flex justify-between p-4">
        <h1 className="text-2xl">Meme Drunk</h1>
        <div className="flex items-center">
          {/* Dark Mode Toggle */}
          <button onClick={toggleDarkMode} className="p-2">
            {darkMode ? <MdOutlineWbSunny size={24} /> : <MdOutlineDarkMode size={24} />}
          </button>

          {/* Favorites */}
          <button onClick={() => console.log(favorites)} className="p-2">
            Favorites ({favorites.length})
          </button>
        </div>
      </nav>

      <div className="flex flex-wrap justify-center">
        {loading ? (
          <p>Loading...</p>
        ) : (
          memes.map((meme) => (
            <div className="card m-4" key={meme.id}>
              {/* Optimized Image */}
              <Image src={meme.url} alt={meme.title} width={300} height={300} className="rounded" />
              <div className="flex justify-between mt-2">
                <button onClick={() => toggleFavorite(meme.id)}>
                  {favorites.some((fav) => fav.id === meme.id) ? (
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

      {/* Load More Memes Button */}
      <button className="load-more mt-6 p-2 bg-blue-500 text-white rounded" onClick={fetchMemes}>
        Load More Memes
      </button>
    </div>
  );
};

export default Home;
