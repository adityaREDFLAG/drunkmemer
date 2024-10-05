'use client'; // Client component for interactivity

import { useState, useEffect } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { BiShareAlt } from 'react-icons/bi'; // Share icon

interface Meme {
  url: string;
  title: string;
}

export default function Home() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(false);
  const [likedMemes, setLikedMemes] = useState<Meme[]>([]);
  const [activeTab, setActiveTab] = useState('home');
  const [fetchedUrls, setFetchedUrls] = useState<Set<string>>(new Set());

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
      
      const newMemes = data.memes.filter((meme: Meme) => !fetchedUrls.has(meme.url));

      if (newMemes.length > 0) {
        setMemes((prevMemes) => [...prevMemes, ...newMemes]);
        setFetchedUrls((prevUrls) => new Set([...prevUrls, ...newMemes.map(meme => meme.url)]));
      }
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
      <h1 className="text-center text-4xl font-extrabold text-accent mb-8 py-4">Drunk Memer</h1>

      {/* Tab Navigation */}
      <div className="flex justify-center space-x-6 mb-6">
        <button
          className={`text-xl font-bold py-2 px-4 ${activeTab === 'home' ? 'text-accent' : 'text-gray-400'}`}
          onClick={() => switchTab('home')}
        >
          Home
        </button>
        <button
          className={`text-xl font-bold py-2 px-4 ${activeTab === 'favorites' ? 'text-accent' : 'text-gray-400'}`}
          onClick={() => switchTab('favorites')}
        >
          Favorites ❤️
        </button>
      </div>

      {/* Single Meme View */}
      <div className="flex flex-col items-center">
        {(activeTab === 'home' ? memes : likedMemes).map((meme, index) => (
          <div key={index} className="w-full sm:w-3/4 md:w-2/4 lg:w-1/3 mb-10 animate-slide-in">
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <img
                src={meme.url}
                alt={meme.title}
                className="w-full h-auto object-contain transition-transform duration-500 ease-in-out hover:scale-105"
              />
              <div className="p-4 flex justify-between items-center">
                <p className="text-lg font-semibold truncate text-gray-200">{meme.title}</p>

                {/* Like/Unlike button with animation */}
                <div className="flex space-x-4 items-center">
                  <button
                    className={`text-2xl transition-transform duration-300 ${
                      likedMemes.some((likedMeme) => likedMeme.url === meme.url)
                        ? 'text-accent scale-125'
                        : 'text-gray-400'
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
                    className="text-2xl text-gray-400 hover:text-accent transition-colors"
                    onClick={() => handleShare(meme)}
                  >
                    <BiShareAlt />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
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
