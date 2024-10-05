'use client'; // Client component for interactivity

import { useState, useEffect } from 'react';

interface Meme {
  url: string;
  title: string;
}

export default function Home() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(false);
  const [likes, setLikes] = useState<number[]>([]);

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
      setLikes((prevLikes) => [...prevLikes, ...Array(data.memes.length).fill(0)]); // Set initial likes
    } catch (error) {
      console.error('Error fetching memes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle like button
  const handleLike = (index: number) => {
    const newLikes = [...likes];
    newLikes[index]++;
    setLikes(newLikes);
  };

  // Handle share button
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
      alert('Web Share API is not supported in this browser.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <h1 className="text-center text-4xl font-extrabold text-white mb-8">Drunk Memer</h1>

      {/* Meme Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {memes.map((meme, index) => (
          <div key={index} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
            <img
              src={meme.url}
              alt={meme.title}
              className="w-full h-60 object-cover"
            />
            <div className="p-4">
              <p className="text-lg font-semibold mb-4 truncate text-gray-200">{meme.title}</p>

              {/* Like and Share buttons */}
              <div className="flex justify-between items-center">
                <button
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-200 ease-in-out"
                  onClick={() => handleLike(index)}
                >
                  Like ❤️ ({likes[index]})
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-200 ease-in-out"
                  onClick={() => handleShare(meme)}
                >
                  Share 🔗
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center mt-10">
        <button
          onClick={fetchMemes}
          className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-full shadow-lg transition duration-200 ease-in-out"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Load More Memes'}
        </button>
      </div>
    </div>
  );
}
