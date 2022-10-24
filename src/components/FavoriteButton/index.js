import PropTypes from 'prop-types';
import React from 'react';
import whiteHeartIcon from '../../images/whiteHeartIcon.svg';
import blackHeartIcon from '../../images/blackHeartIcon.svg';

function FavoriteButton({
  isFavorite,
  handleFavorite,

}) {
  return (
    <button
      type="button"
      className="favorite_btn"
      onClick={ handleFavorite }
    >
      {isFavorite ? (
        <img
          src={ blackHeartIcon }
          alt="Favorite Icon"
          data-testid="favorite-btn"
        />)
        : (
          <img
            src={ whiteHeartIcon }
            alt="Favorite Icon"
            data-testid="favorite-btn"
          />)}
    </button>
  );
}

FavoriteButton.propTypes = {
  handleFavorite: PropTypes.func.isRequired,
  isFavorite: PropTypes.bool.isRequired,
};

export default FavoriteButton;
