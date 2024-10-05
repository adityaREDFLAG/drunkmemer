'use client'; // Client component for interactivity

import { useState, useEffect } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { BiHomeCircle, BiHeartCircle, BiShareAlt } from 'react-icons/bi'; // Home, Favorites, and Share icons

interface Meme {
  url: string;
  title: string;
}

export default function Home() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(false);
  const [likedMemes, setLikedMemes] = useState<Meme[]>([]);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const storedLikes = JSON.parse(localStorage.getItem('likedMemes') || '[]');
    setLikedMemes(storedLikes);
    fetchMemes();
  }, []);

  const fetchMemes = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://meme-api.com/gimme/10');
      const data = await response.json();
      
      setMemes((prevMemes) => [...prevMemes, ...data.memes]);
    } catch (error) {
      console.error('Error fetching memes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (meme: Meme) => {
    const isLiked = likedMemes.some((likedMeme) => likedMeme.url === meme.url);
    let updatedLikedMemes;

    if (isLiked) {
      updatedLikedMemes = likedMemes.filter((likedMeme) => likedMeme.url !== meme.url);
    } else {
      updatedLikedMemes = [...likedMemes, meme];
    }

    setLikedMemes(updatedLikedMemes);
    localStorage.setItem('likedMemes', JSON.stringify(updatedLikedMemes));
  };

  const handleShare = async (meme: Meme) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: meme.title,
          url: meme.url,
        });
      } catch (error) {
        console.error('Error sharing meme:', error);
      }
    } else {
      alert('Sharing is not supported on this device.');
    }
  };

  const switchTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-dark text-light">
      <h1 className="header">Drunk Memer</h1>

      {/* Single Meme View */}
      <div className="flex flex-col items-center">
        {(activeTab === 'home' ? memes : likedMemes).map((meme, index) => (
          <div key={index} className="w-full sm:w-3/4 md:w-2/4 lg:w-1/3 mb-10 card">
            <img
              src={meme.url}
              alt={meme.title}
              className="w-full h-auto object-contain transition-transform duration-500 ease-in-out hover:scale-105"
            />
            <div className="p-4 flex justify-between items-center">
              <p className="text-lg font-semibold truncate card-text">{meme.title}</p>

              {/* Like/Unlike button with animation */}
              <div className="flex space-x-4 items-center">
                <button
                  className={`icon ${
                    likedMemes.some((likedMeme) => likedMeme.url === meme.url)
                      ? 'icon-like-active'
                      : 'icon-like'
                  }`}
                  onClick={() => handleLike(meme)}
                >
                  {likedMemes.some((likedMeme) => likedMeme.url === meme.url) ? (
                    <AiFillHeart />
                  ) : (
                    <AiOutlineHeart />
                  )}
                </button>

                {/* Share button */}
                <button
                  className="icon icon-share"
                  onClick={() => handleShare(meme)}
                >
                  <BiShareAlt />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Bar */}
      <div className="nav-bar">
        <button
          className={`nav-button ${activeTab === 'home' ? 'nav-button-active' : ''}`}
          onClick={() => switchTab('home')}
        >
          <BiHomeCircle className="icon" />
        </button>
        <button
          className={`nav-button ${activeTab === 'favorites' ? 'nav-button-active' : ''}`}
          onClick={() => switchTab('favorites')}
        >
          <BiHeartCircle className="icon" />
        </button>
      </div>

      {/* Load More Button */}
      {activeTab === 'home' && (
        <div className="flex justify-center mt-10">
          <button
            onClick={fetchMemes}
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More Memes'}
          </button>
        </div>
      )}
    </div>
  );
}
