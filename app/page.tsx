'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

// Define the type for a meme
interface Meme {
  url: string;
  title: string;
}

export default function Home() {
  // Set memes state to be an array of Meme objects
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch memes from the Meme API
  const fetchMemes = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://meme-api.com/gimme/10');
      setMemes((prevMemes) => [...prevMemes, ...response.data.memes]);
    } catch (error) {
      console.error('Error fetching memes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchMemes();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-center text-3xl font-bold text-balance mb-6">Drunk Memer</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {memes.map((meme, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-4 shadow-md">
            <img src={meme.url} alt={meme.title} className="rounded-lg mb-4" />
            <p className="text-white">{meme.title}</p>
          </div>
        ))}
      </div>

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
