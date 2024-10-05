'use client'; // Client component for interactivity

import { useState, useEffect } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'; // Heart icons for like/unlike

interface Meme {
  url: string;
  title: string;
}

export default function Home() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(false);
  const [likedMemes, setLikedMemes] = useState<Meme[]>([]);
  const [activeTab, setActiveTab] = useState('home'); // Toggle between Home and Favorites

  // Load liked memes from localStorage on component mount
  useEffect(() => {
    const storedLikes = JSON.parse(localStorage.getItem('likedMemes') || '[]');
    setLikedMemes(storedLikes);
    fetchMemes();
  }, []);

  // Fetch memes from the API
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

  // Handle like/unlike meme
  const handleLike = (meme: Meme) => {
    const isLiked = likedMemes.some((likedMeme) => likedMeme.url === meme.url);
    let updatedLikedMemes;

    if (isLiked) {
      updatedLikedMemes = likedMemes.filter((likedMeme) => likedMeme.url !== meme.url);
    } else {
      updatedLikedMemes = [...likedMemes, meme];
    }

    setLikedMemes(updatedLikedMemes);
    localStorage.setItem('likedMemes', JSON.stringify(updatedLikedMemes)); // Save to localStorage
  };

  // Handle switching between tabs (Home/Favorites)
  const switchTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <h1 className="text-center text-4xl font-extrabold text-white mb-8 py-4">Drunk Memer</h1>

      {/* Tab Navigation */}
      <div className="flex justify-center space-x-6 mb-6">
        <button
          className={`text-xl font-bold py-2 px-4 ${activeTab === 'home' ? 'text-yellow-500' : 'text-gray-400'}`}
          onClick={() => switchTab('home')}
        >
          Home
        </button>
        <button
          className={`text-xl font-bold py-2 px-4 ${activeTab === 'favorites' ? 'text-yellow-500' : 'text-gray-400'}`}
          onClick={() => switchTab('favorites')}
        >
          Favorites ❤️
        </button>
      </div>

      {/* Single Meme View */}
      <div className="flex flex-col items-center">
        {(activeTab === 'home' ? memes : likedMemes).map((meme, index) => (
          <div key={index} className="w-full sm:w-3/4 md:w-2/4 lg:w-1/3 mb-10">
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <img
                src={meme.url}
                alt={meme.title}
                className="w-full h-auto object-contain" // No cropping, maintains aspect ratio
              />
              <div className="p-4 flex justify-between items-center">
                <p className="text-lg font-semibold truncate text-gray-200">{meme.title}</p>

                {/* Like/Unlike button */}
                <button
                  className={`${
                    likedMemes.some((likedMeme) => likedMeme.url === meme.url)
                      ? 'text-red-500'
                      : 'text-gray-400'
                  } text-2xl`}
                  onClick={() => handleLike(meme)}
                >
                  {likedMemes.some((likedMeme) => likedMeme.url === meme.url) ? (
                    <AiFillHeart />
                  ) : (
                    <AiOutlineHeart />
                  )}
                </button>
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
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-full shadow-lg transition duration-200 ease-in-out"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More Memes'}
          </button>
        </div>
      )}
    </div>
  );
}
