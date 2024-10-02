"use client";// app/page.tsx

import { useEffect, useState } from "react";
import { FaHeart, FaShare } from "react-icons/fa";

export default function HomePage() {
  const [memes, setMemes] = useState([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    // Fetch memes from the API
    const fetchMemes = async () => {
      const response = await fetch("https://meme-api.com/gimme/10");
      const data = await response.json();
      setMemes(data.memes);
    };

    fetchMemes();

    const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(storedFavorites);
  }, []);

  const toggleFavorite = (id: string) => {
    const updatedFavorites = favorites.includes(id)
      ? favorites.filter(favId => favId !== id)
      : [...favorites, id];

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const shareMeme = (url: string) => {
    navigator.clipboard.writeText(url);
    alert("Meme link copied to clipboard!");
  };

  return (
    <div>
      <nav className="navbar">
        <h1>Meme Drunk</h1>
        <button className="button" onClick={() => { /* Logic to show favorites */ }}>Favorites</button>
      </nav>
      <div className="flex flex-wrap justify-center">
        {memes.map((meme) => (
          <div className="card" key={meme.id}>
            <img src={meme.url} alt={meme.title} className="rounded" />
            <div className="flex justify-between mt-2">
              <button className="button" onClick={() => toggleFavorite(meme.id)}>
                <FaHeart className={`icon ${favorites.includes(meme.id) ? "text-red-600" : ""}`} />
              </button>
              <button className="button" onClick={() => shareMeme(meme.url)}>
                <FaShare className="icon" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
