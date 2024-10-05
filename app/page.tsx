'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaHeart, FaShareAlt, FaHome, FaStar, FaSearch } from 'react-icons/fa';
import './global.css'; // Import the CSS file

// Define the type for a meme
interface Meme {
  title: string;
  url: string;
}

export default function Home() {
  const [memes, setMemes] = useState<Meme[]>([]); // Define the type of memes
  const [likedMemes, setLikedMemes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMemes, setFilteredMemes] = useState<Meme[]>([]); // Define the type of filteredMemes

  // Fetch memes from the API
  const fetchMemes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://meme-api.com/gimme/10');
      setMemes((prevMemes) => [...prevMemes, ...response.data.memes]);
      setFilteredMemes((prevMemes) => [...prevMemes, ...response.data.memes]);
    } catch (error) {
      console.error('Error fetching memes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemes();
  }, []);

  // Handle meme search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value === '') {
      setFilteredMemes(memes);
    } else {
      const filtered = memes.filter((meme) =>
        meme.title.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredMemes(filtered);
    }
  };

  // Toggle like for memes
  const toggleLike = (memeUrl: string) => {
    if (likedMemes.includes(memeUrl)) {
      setLikedMemes(likedMemes.filter((url) => url !== memeUrl));
    } else {
      setLikedMemes([...likedMemes, memeUrl]);
    }
  };

  return (
    <div>
      {/* Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search memes..."
          value={searchQuery}
          onChange={handleSearch}
        />
        <FaSearch style={{ marginLeft: '10px', fontSize: '1.5rem', color: '#f0f0f0' }} />
      </div>

      {/* Meme Cards */}
      <div>
        {filteredMemes.map((meme) => (
          <div key={meme.url} className="card">
            <p>{meme.title}</p>
            <img
              src={meme.url}
              alt={meme.title}
              style={{ width: '100%', height: 'auto', borderRadius: '12px', marginBottom: '10px' }}
            />
            {/* Like and Share Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => toggleLike(meme.url)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: likedMemes.includes(meme.url) ? '#f44336' : '#f0f0f0',
                  fontSize: '1.5rem',
                }}
              >
                <FaHeart />
              </button>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#f0f0f0',
                  fontSize: '1.5rem',
                }}
                onClick={() => {
                  navigator.clipboard.writeText(meme.url);
                  alert('Meme link copied!');
                }}
              >
                <FaShareAlt />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Loading State */}
      {loading && <p className="loading">Loading more memes...</p>}

      {/* Navigation Bar */}
      <div className="nav-bar">
        <FaHome className="nav-button" />
        <FaStar className="nav-button" />
        <FaHeart className="nav-button" />
      </div>
    </div>
  );
}
