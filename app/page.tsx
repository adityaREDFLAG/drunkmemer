'use client';
'use client';

import { useState, useEffect } from 'react';

// Define the type of a meme (you may adjust based on the actual data structure)
type Meme = {
  title: string;
  url: string;
};

const MemeDrunk = () => {
  // Correctly type the state to expect an array of Meme objects
  const [memes, setMemes] = useState<Meme[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchMemes();
  }, [page]);

  const fetchMemes = async () => {
    try {
      const response = await fetch(`https://meme-api.com/gimme/10?page=${page}`);
      const data = await response.json();
      setMemes((prev) => [...prev, ...data.memes]); // Spread operator to add new memes
    } catch (error) {
      console.error('Error fetching memes:', error);
    }
  };

  return (
    <div className="meme-container">
      {memes.map((meme, index) => (
        <div key={index} className="meme-card">
          <h3>{meme.title}</h3>
          <img src={meme.url} alt={meme.title} />
          <div className="buttons">
            <button className="like-btn">❤️ Like</button>
            <button className="share-btn">🔗 Share</button>
          </div>
        </div>
      ))}
      <button className="load-more" onClick={() => setPage(page + 1)}>
        Load More Memes
      </button>
    </div>
  );
};

export default MemeDrunk;
