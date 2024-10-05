'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaHeart, FaShareAlt, FaHome, FaStar, FaSearch } from 'react-icons/fa';

export default function Home() {
  const [memes, setMemes] = useState([]);
  const [likedMemes, setLikedMemes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMemes, setFilteredMemes] = useState([]);

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
    <div style={{ color: '#f0f0f0', backgroundColor: '#1a1a1a', minHeight: '100vh', padding: '20px' }}>
      {/* Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search memes..."
          value={searchQuery}
          onChange={handleSearch}
          style={{
            padding: '10px',
            width: '300px',
            borderRadius: '8px',
            backgroundColor: '#333',
            color: '#f0f0f0',
            border: '1px solid #f0f0f0',
          }}
        />
        <FaSearch style={{ marginLeft: '10px', fontSize: '1.5rem', color: '#f0f0f0' }} />
      </div>

      {/* Meme Cards */}
      <div>
        {filteredMemes.map((meme) => (
          <div
            key={meme.url}
            className="card"
            style={{
              backgroundColor: '#222',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
          >
            <p style={{ color: '#f0f0f0', marginBottom: '10px' }}>{meme.title}</p>
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
      {loading && <p style={{ textAlign: 'center' }}>Loading more memes...</p>}

      {/* Navigation Bar */}
      <div
        className="nav-bar"
        style={{
          position: 'fixed',
          bottom: '0',
          left: '0',
          right: '0',
          height: '60px',
          backgroundColor: '#1c1c1c',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          borderTop: '1px solid #333',
        }}
      >
        <FaHome style={{ color: '#f0f0f0', fontSize: '1.6rem' }} />
        <FaStar style={{ color: '#f0f0f0', fontSize: '1.6rem' }} />
        <FaHeart style={{ color: '#f0f0f0', fontSize: '1.6rem' }} />
      </div>
    </div>
  );
}
