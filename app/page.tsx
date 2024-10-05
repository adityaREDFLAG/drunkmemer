
'use client'; // Make the component interactive

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
    <div className="p-6">
      <h1 className="text-center text-3xl font-bold text-gray-900 mb-6">Drunk Memer</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {memes.map((meme, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-4 shadow-md">
            <img src={meme.url} alt={meme.title} className="rounded-lg mb-4" />
            <p className="text-white">{meme.title}</p>

            {/* Like and Share buttons */}
            <div className="mt-4 flex justify-between items-center">
              <button
                className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition"
                onClick={() => handleLike(index)}
              >
                Like ({likes[index]})
              </button>
              <button
                className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition"
                onClick={() => handleShare(meme)}
              >
                Share
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <button
        onClick={fetchMemes}
        className="mt-8 bg-yellow-500 text-gray-900 py-2 px-6 rounded-lg hover:bg-yellow-600 transition"
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Load More Memes'}
      </button>
    </div>
  );
}
