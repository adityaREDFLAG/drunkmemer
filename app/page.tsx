'use client'; // Client component for interactivity

import { useState, useEffect, useRef } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { BiHomeCircle, BiHeartCircle, BiShareAlt } from 'react-icons/bi'; // Home, Favorites, and Share icons

interface Meme {
  url: string;
  title: string;
  author: string; // Add author property to the Meme type
}

export default function Home() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [likedMemes, setLikedMemes] = useState<Meme[]>([]);
  const [activeTab, setActiveTab] = useState<'home' | 'favorites'>('home');
  const loadMoreRef = useRef<HTMLDivElement | null>(null); // Ref for load more div

  useEffect(() => {
    const storedLikes = JSON.parse(localStorage.getItem('likedMemes') || '[]') as Meme[];
    setLikedMemes(storedLikes);
    fetchMemes();
  }, []);

  // Infinite scroll logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && activeTab === 'home') {
          fetchMemes();
        }
      },
      {
        rootMargin: '100px',
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [loading, activeTab]);

  const fetchMemes = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://meme-api.com/gimme/10'); // Using the original base URL
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
    let updatedLikedMemes: Meme[];

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

  const switchTab = (tab: 'home' | 'favorites') => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen">
      <h1 className="header">Drunk Memer</h1>

      {/* Single Meme View */}
      <div className="flex flex-col items-center">
        {(activeTab === 'home' ? memes : likedMemes).map((meme, index) => (
          <div key={index} className="w-full sm:w-3/4 md:w-2/4 lg:w-1/3 card">
            <img
              src={meme.url}
              alt={meme.title}
              className="w-full h-auto object-contain"
            />
            <div className="p-4 flex justify-between items-center">
              <div>
                {/* Title and author */}
                <p className="text-lg font-semibold truncate card-text">
                  {meme.title}
                </p>
                <p className="text-sm text-gray-400">by {meme.author}</p> {/* Display the author under title */}
              </div>

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

      {/* Infinite Scroll Trigger */}
      <div ref={loadMoreRef} className="h-20" />

      {/* Navigation Bar */}
      <div className="nav-bar">
        <button
          className={`nav-button ${activeTab === 'home' ? 'nav-button-active' : ''}`}
          onClick={() => switchTab('home')}
        >
          <BiHomeCircle />
        </button>
        <button
          className={`nav-button ${activeTab === 'favorites' ? 'nav-button-active' : ''}`}
          onClick={() => switchTab('favorites')}
        >
          <BiHeartCircle />
        </button>
      </div>
    </div>
  );
}
