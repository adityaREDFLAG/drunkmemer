'use client';
import { useState } from 'react';
import axios from 'axios';

// Define the type for a meme
interface Meme {
  url: string;
  title: string;
}

interface HomeProps {
  initialMemes: Meme[];
}

export default function Home({ initialMemes }: HomeProps) {
  const [memes, setMemes] = useState<Meme[]>(initialMemes);
  const [loading, setLoading] = useState(false);
  const [likes, setLikes] = useState<number[]>(Array(initialMemes.length).fill(0)); // Track likes for each meme

  // Fetch more memes
  const fetchMemes = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://meme-api.com/gimme/10');
      setMemes((prevMemes) => [...prevMemes, ...response.data.memes]);
      setLikes((prevLikes) => [...prevLikes, ...Array(response.data.memes.length).fill(0)]); // Initialize likes for new memes
    } catch (error) {
      console.error('Error fetching memes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle like
  const handleLike = (index: number) => {
    const newLikes = [...likes];
    newLikes[index]++;
    setLikes(newLikes);
  };

  // Handle share using the Web Share API
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

// Server-side rendering to fetch initial memes
export async function getServerSideProps() {
  try {
    const response = await axios.get('https://meme-api.com/gimme/10');
    return {
      props: {
        initialMemes: response.data.memes,
      },
    };
  } catch (error) {
    console.error('Error fetching memes:', error);
    return {
      props: {
        initialMemes: [],
      },
    };
  }
}
