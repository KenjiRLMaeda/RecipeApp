import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import profileIcon from '../../images/profileIcon.svg';
import searchIcon from '../../images/searchIcon.svg';
import SearchBar from '../SearchBar';
import './index.css';

function Header({ isSearchVisible, headerTitle }) {
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);

  const toggleSearchBar = () => {
    if (isSearchBarVisible) {
      setIsSearchBarVisible(false);
    } else {
      setIsSearchBarVisible(true);
    }
  };

  return (
    <header>
      <div className="header-container">
        <Link className="header-icons" to="/profile">
          <img
            className="header-icons-img"
            src={ profileIcon }
            alt="profile-icon"
            data-testid="profile-top-btn"
          />
        </Link>
        <h1 className="header-title" data-testid="page-title">
          { headerTitle }
        </h1>
        <button
          className={ `header-icons${!isSearchVisible ? ' hidden' : ''}` }
          type="button"
          disabled={ !isSearchVisible }
          onClick={ toggleSearchBar }
        >
          <img
            className="header-icons-img"
            src={ searchIcon }
            alt="search-icon"
            data-testid={ isSearchVisible ? 'search-top-btn' : '' }
          />
        </button>

      </div>
      {
        isSearchBarVisible && (
          <SearchBar />
        )
      }
    </header>
  );
}

Header.propTypes = {
  isSearchVisible: PropTypes.bool,
  headerTitle: PropTypes.string.isRequired,
};

Header.defaultProps = {
  isSearchVisible: true,
};

export default Header;
