"use client";// app/page.tsx

import { useEffect, useState } from "react";
import localFont from "next/font/local";
import { FaHeart, FaShareAlt, FaMoon, FaSun } from "react-icons/fa";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

interface Meme {
  id: string;
  url: string;
  title: string;
}

export default function RootLayout() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [page, setPage] = useState(1);

  const fetchMemes = async (pageNum: number) => {
    const response = await fetch(`https://meme-api.com/gimme/10/${pageNum}`);
    const data = await response.json();
    const newMemes = data.memes.filter(
      (newMeme: Meme) => !memes.some((meme) => meme.id === newMeme.id)
    );
    setMemes((prevMemes) => [...prevMemes, ...newMemes]);
  };

  useEffect(() => {
    fetchMemes(page);
  }, [page]);

  const toggleFavorite = (id: string) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(id)
        ? prevFavorites.filter((favId) => favId !== id)
        : [...prevFavorites, id]
    );
  };

  const loadMoreMemes = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased ${darkMode ? "dark" : ""}`}>
        <nav className="navbar">
          <h1 className="logo">Meme Drunk</h1>
          <div className="navbar-icons">
            <button onClick={toggleDarkMode} className="button toggle-theme">
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
            <button onClick={loadMoreMemes} className="button load-more">
              Load More Memes
            </button>
          </div>
        </nav>
        <div className="flex flex-wrap justify-center">
          {memes.map((meme) => (
            <div className="card" key={meme.id}>
              <img src={meme.url} alt={meme.title} className="rounded" />
              <div className="flex justify-between mt-2">
                <button
                  className={`button favorite ${favorites.includes(meme.id) ? "active" : ""}`}
                  onClick={() => toggleFavorite(meme.id)}
                >
                  <FaHeart />
                </button>
                <button className="button share">
                  <FaShareAlt />
                </button>
              </div>
            </div>
          ))}
        </div>
      </body>
      <style jsx>{`
        body {
          background-color: ${darkMode ? "#1f1f1f" : "#ffffff"};
          color: ${darkMode ? "#ffffff" : "#000000"};
        }
        .navbar {
          display: flex;
          justify-content: space-between;
          padding: 16px;
          background-color: ${darkMode ? "#333333" : "#f0f0f0"};
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
        }
        .navbar-icons {
          display: flex;
          gap: 10px;
        }
        .button {
          background: transparent;
          border: none;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .button:hover {
          transform: scale(1.1);
        }
        .card {
          width: 300px;
          margin: 10px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: ${darkMode ? "0 4px 10px rgba(0, 0, 0, 0.7)" : "0 2px 10px rgba(0, 0, 0, 0.1)"};
        }
        img {
          width: 100%;
          border-radius: 8px 8px 0 0;
        }
        .favorite.active {
          color: red;
        }
      `}</style>
    </html>
  );
}
