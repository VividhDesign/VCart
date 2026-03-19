import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/search?query=${query}` : '/search');
  };

  return (
    <form onSubmit={submitHandler} className="search-form" style={{ flex: 1, maxWidth: 440, margin: '0 16px' }}>
      <input
        type="text"
        className="search-input"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className="search-btn" id="search-submit">
        <i className="fas fa-search"></i>
      </button>
    </form>
  );
}
