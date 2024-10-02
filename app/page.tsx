"use client";// app/page.tsx

import { useEffect, useState } from "react";
import { Metadata } from "next";
import localFont from "next/font/local";
import "./global.css";
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

export const metadata: Metadata = {
  title: "Meme Drunk",
  description: "Your favorite meme sharing app",
};

interface Meme {
  id: string;
  url: string;
  title: string;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
                  className={`button favorite ${
                    favorites.includes(meme.id) ? "active" : ""
                  }`}
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
    </html>
  );
}
