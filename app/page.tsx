'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaHeart, FaShareAlt, FaHome, FaStar } from 'react-icons/fa';

export default function Home() {
  const [memes, setMemes] = useState([]);
  const [likedMemes, setLikedMemes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMemes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://meme-api.com/gimme/1');
      setMemes((prevMemes) => [...prevMemes, ...response.data.memes]);
    } catch (error) {
      console.error('Error fetching memes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemes();
  }, []);

  const toggleLike = (url: string) => {
    if (likedMemes.includes(url)) {
      setLikedMemes(likedMemes.filter((likedUrl) => likedUrl !== url));
    } else {
      setLikedMemes([...likedMemes, url]);
    }
  };

  return (
    <div className="container">
      <h1 className="text-center text-3xl font-bold mb-6">Drunk Memer</h1>
      <div className="meme-container">
        {memes.map((meme, index) => (
          <div key={index} className="card">
            <img src={meme.url} alt="Meme" className="meme-image" />
            <div className="actions">
              <button
                className={`icon ${likedMemes.includes(meme.url) ? 'icon-like-active' : 'icon-like'}`}
                onClick={() => toggleLike(meme.url)}
              >
                <FaHeart />
              </button>
              <button className="icon icon-share">
                <FaShareAlt />
              </button>
            </div>
          </div>
        ))}
        {loading && <p>Loading...</p>}
      </div>

      {/* Navigation Bar */}
      <div className="nav-bar">
        <button className="nav-button">
          <FaHome />
        </button>
        <button className="nav-button">
          <FaStar />
        </button>
      </div>
    </div>
  );
}
