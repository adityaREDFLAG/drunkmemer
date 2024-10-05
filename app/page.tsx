import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaHeart, FaShareAlt, FaHome, FaStar, FaSearch } from 'react-icons/fa';

export default function Home() {
  const [memes, setMemes] = useState([]);
  const [likedMemes, setLikedMemes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMemes, setFilteredMemes] = useState([]);

  // Function to fetch random memes
  const fetchMemes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://meme-api.com/gimme/10');
      setMemes((prevMemes) => [...prevMemes, ...response.data.memes]);
      setFilteredMemes((prevMemes) => [...prevMemes, ...response.data.memes]); // Store filtered memes for search
    } catch (error) {
      console.error('Error fetching memes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemes();
  }, []);

  // Function to handle search input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value === '') {
      setFilteredMemes(memes); // Reset to all memes if search is cleared
    } else {
      const filtered = memes.filter((meme) =>
        meme.title.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredMemes(filtered);
    }
  };

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
      
      {/* Search Bar */}
      <div className="search-bar flex justify-center mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search memes..."
          className="search-input border p-2 rounded w-80"
        />
        <button className="icon-search ml-2">
          <FaSearch />
        </button>
      </div>

      <div className="meme-container">
        {filteredMemes.length > 0 ? (
          filteredMemes.map((meme, index) => (
            <div key={index} className="card">
              <img src={meme.url} alt="Meme" className="meme-image" />
              <p className="meme-title">{meme.title}</p>
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
          ))
        ) : (
          <p>No memes found for "{searchQuery}".</p>
        )}
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
