import { useState, useEffect } from "react";
import { FaHeart, FaStar, FaHome } from "react-icons/fa";
import "./global.css";

export default function App() {
  const [memes, setMemes] = useState([]);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || []
  );

  useEffect(() => {
    fetchMemes();
  }, []);

  const fetchMemes = async () => {
    const response = await fetch("https://meme-api.com/gimme/50");
    const data = await response.json();
    setMemes(data.memes);
  };

  const handleLike = (meme) => {
    const updatedFavorites = [...favorites, meme];
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Navbar />
      <div className="container mx-auto p-4 mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {memes.map((meme) => (
            <div
              key={meme.url}
              className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105"
            >
              <img
                src={meme.url}
                alt="meme"
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <button
                  onClick={() => handleLike(meme)}
                  className="flex items-center justify-center w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  <FaHeart className="mr-2" /> Like
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <FavoritesTab favorites={favorites} />
    </div>
  );
}

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-800 text-white py-4 shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-2xl font-bold">Meme Drunk</h1>
        <ul className="flex space-x-4">
          <li className="hover:text-red-500 transition-colors">
            <FaHome /> Home
          </li>
          <li className="hover:text-red-500 transition-colors">
            <FaStar /> Favorites
          </li>
        </ul>
      </div>
    </nav>
  );
}

function FavoritesTab({ favorites }) {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Favorites</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((meme) => (
          <div
            key={meme.url}
            className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105"
          >
            <img
              src={meme.url}
              alt="meme"
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <p className="text-center">Liked Meme</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
