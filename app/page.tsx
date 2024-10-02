"use client";
import React, { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import "./global.css";

interface Meme {
  url: string;
  title: string;
}

export default function HomePage() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    // Fetch memes from API
    fetch("https://meme-api.com/gimme/10")
      .then((response) => response.json())
      .then((data) => {
        setMemes(data.memes);
      });

    // Load favorites from localStorage
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const handleLike = (memeUrl: string) => {
    if (favorites.includes(memeUrl)) {
      const newFavorites = favorites.filter((url) => url !== memeUrl);
      setFavorites(newFavorites);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
    } else {
      setFavorites((prev) => {
        const newFavorites = [...prev, memeUrl];
        localStorage.setItem("favorites", JSON.stringify(newFavorites));
        return newFavorites;
      });
    }
  };

  return (
    <div className="container">
      <h1 className="title">Meme Drunk</h1>
      <div className="meme-grid">
        {memes.map((meme) => (
          <div key={meme.url} className="meme-card">
            <img src={meme.url} alt={meme.title} className="meme-image" />
            <button
              className={`like-button ${favorites.includes(meme.url) ? 'liked' : ''}`}
              onClick={() => handleLike(meme.url)}
            >
              <FaHeart />
            </button>
          </div>
        ))}
      </div>
      <h2 className="favorites-title">Favorites</h2>
      <div className="favorites-grid">
        {favorites.map((url) => (
          <img key={url} src={url} alt="Favorite meme" />
        ))}
      </div>
    </div>
  );
}
