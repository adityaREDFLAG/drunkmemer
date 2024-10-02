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

  useEffect(() => {
    // Sync favorites to local storage
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (memeUrl: string) => {
    if (favorites.includes(memeUrl)) {
      setFavorites(favorites.filter((url) => url !== memeUrl)); // Unlike
    } else {
      setFavorites([...favorites, memeUrl]); // Like
    }
  };

  const isFavorite = (memeUrl: string) => favorites.includes(memeUrl);

  return (
    <div className="container">
      <h1 className="title">Meme Drunk</h1>
      <div className="meme-grid">
        {memes.map((meme) => (
          <div key={meme.url} className="meme-item">
            <img src={meme.url} alt={meme.title} className="meme-image" />
            <button
              className={`like-button ${isFavorite(meme.url) ? "liked" : ""}`}
              onClick={() => toggleFavorite(meme.url)}
            >
              <FaHeart />
            </button>
          </div>
        ))}
      </div>
      <h2 className="favorites-title">Favorites</h2>
      <div className="favorites-grid">
        {favorites.length > 0 ? (
          favorites.map((fav) => (
            <img key={fav} src={fav} alt="Favorite Meme" className="meme-image" />
          ))
        ) : (
          <p>No favorites yet!</p>
        )}
      </div>
    </div>
  );
}
