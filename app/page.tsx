'use client'; // For client-side interactions

import { useState, useEffect } from 'react';

interface Meme {
  url: string;
  title: string;
}

export default function Home() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(false);
  const [likes, setLikes] = useState<number[]>([]);
  const [likedMemes, setLikedMemes] = useState<Meme[]>([]);
  const [activeTab, setActiveTab] = useState('home'); // Toggle between Home and Favorites

  // Fetch memes on component mount
  useEffect(() => {
    fetchMemes();
  }, []);

  // Fetch memes from the API
  const fetchMemes = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://meme-api.com/gimme/10');
      const data = await response.json();
      setMemes((prevMemes) => [...prevMemes, ...data.memes]);
      setLikes((prevLikes) => [...prevLikes, ...Array(data.memes.length).fill(0)]); // Set initial likes to zero
    } catch (error) {
      console.error('Error fetching memes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle like/unlike button
  const handleLike = (index: number, meme: Meme) => {
    const newLikes = [...likes];
    // Toggle like/unlike logic
    if (newLikes[index] === 0) {
      newLikes[index] = 1;
      setLikedMemes((prevLikedMemes) => [...prevLikedMemes, meme]); // Add meme to favorites
    } else {
      newLikes[index] = 0;
      setLikedMemes((prevLikedMemes) => prevLikedMemes.filter((likedMeme) => likedMeme.url !== meme.url)); // Remove from favorites
    }
    setLikes(newLikes);
  };

  // Handle switching between tabs (Home/Favorites)
  const switchTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <h1 className="text-center text-4xl font-extrabold text-white mb-8">Drunk Memer</h1>

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

      {/* Meme Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {(activeTab === 'home' ? memes : likedMemes).map((meme, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300"
          >
            <img
              src={meme.url}
              alt={meme.title}
              className="w-full h-60 object-cover"
            />
            <div className="p-4">
              <p className="text-lg font-semibold mb-4 truncate text-gray-200">{meme.title}</p>

              {/* Like/Unlike button */}
              <div className="flex justify-center">
                <button
                  className={`${
                    likes[index] === 1 ? 'text-red-500' : 'text-gray-400'
                  } font-bold text-2xl`}
                  onClick={() => handleLike(index, meme)}
                >
                  ❤️
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
