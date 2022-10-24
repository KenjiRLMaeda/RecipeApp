import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

function IngredientCard({ index, name, handleClick, api }) {
  return (
    <button
      className="ingredient-card-container"
      type="button"
      onClick={ () => handleClick(name) }
      data-testid={ `${index}-ingredient-card` }
    >
      <img
        className="ingredient-card-image"
        data-testid={ `${index}-card-img` }
        src={ `https://www.the${api}db.com/images/ingredients/${name}-Small.png` }
        alt={ name }
      />
      <h1 className="ingredient-card-h1" data-testid={ `${index}-card-name` }>
        { name }
      </h1>
    </button>
  );
}

IngredientCard.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  api: PropTypes.string.isRequired,
};

export default IngredientCard;
