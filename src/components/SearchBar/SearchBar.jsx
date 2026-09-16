import { useState } from 'react';
import './SearchBar.css';

export function SearchBar({ onSearch, placeholder = 'Buscar empresa...', showFavorites = false, onToggleFavorites, favoritesOnly = false }) {
  const [term, setTerm] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(term.trim());
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        className="form-input search-bar__input"
        placeholder={placeholder}
        value={term}
        onChange={(event) => setTerm(event.target.value)}
      />
      <button type="submit" className="btn btn-primary" aria-label="Buscar">
        Buscar
      </button>
      {showFavorites && (
        <button
          type="button"
          className={`btn ${favoritesOnly ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => onToggleFavorites?.(!favoritesOnly)}
          aria-pressed={favoritesOnly}
        >
          {favoritesOnly ? 'Ver todas' : 'Solo favoritos'}
        </button>
      )}
    </form>
  );
}

export default SearchBar;
