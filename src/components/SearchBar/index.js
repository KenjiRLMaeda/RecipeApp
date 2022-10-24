import React, { useContext, useState } from 'react';
import myContext from '../../context/myContext';
import './index.css';

const FIRST_LETTER = 'first-letter';

function SearchBar() {
  const [localSearchInput, setLocalSearchInput] = useState('');
  const [localSearchType, setLocalSearchType] = useState('name');

  const { setSearch } = useContext(myContext);

  const handleClick = () => {
    if (localSearchType === FIRST_LETTER && localSearchInput.length !== 1) {
      global.alert('Your search must have only 1 (one) character');
    } else {
      setSearch({ input: localSearchInput, type: localSearchType });
    }
  };

  return (
    <div className="searchbar-container">
      <input
        className="search-input"
        placeholder="Search Recipe"
        data-testid="search-input"
        value={ localSearchInput }
        onChange={ ({ target }) => setLocalSearchInput(target.value) }
      />
      <div className="search-types-container">
        <label className="search-type-label" htmlFor="search-ingredient">
          <input
            id="search-ingredient"
            type="radio"
            name="localSearchType"
            data-testid="ingredient-search-radio"
            value="ingredient"
            checked={ localSearchType === 'ingredient' }
            onChange={ () => setLocalSearchType('ingredient') }
          />
          Ingredient
        </label>
        <label className="search-type-label" htmlFor="search-name">
          <input
            id="search-name"
            type="radio"
            name="localSearchType"
            data-testid="name-search-radio"
            value="name"
            checked={ localSearchType === 'name' }
            onChange={ () => setLocalSearchType('name') }
          />
          Name
        </label>
        <label className="search-type-label" htmlFor="search-first-letter">
          <input
            id="search-first-letter"
            type="radio"
            name="localSearchType"
            data-testid="first-letter-search-radio"
            value="first-letter"
            checked={ localSearchType === FIRST_LETTER }
            onChange={ () => setLocalSearchType(FIRST_LETTER) }
          />
          First Letter
        </label>
      </div>
      <button
        className="search-button"
        type="button"
        data-testid="exec-search-btn"
        onClick={ handleClick }
      >
        Search
      </button>
    </div>
  );
}

export default SearchBar;
